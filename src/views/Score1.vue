<template>
    <div>
        <el-card class="cardStyle" v-loading="loading">
        <!-- 功能按钮 -->
        <el-button @click="change" size="small" style="margin-bottom: 15px">筛选</el-button>
        <el-button @click="batchMethod" type="info" size="small" :disabled="dataTable.length <= 0" style="margin-bottom: 15px">批量编辑</el-button>
        <el-button @click="addEntry" type="primary" size="small" style="margin-bottom: 15px">成绩录入</el-button>
        <el-button @click="exportMethod" type="success" :disabled="dataTable.length <= 0" size="small" style="margin-bottom: 15px">导出</el-button>
        <el-button
          @click="batchDelete"
          type="danger"
          size="small"
          :disabled="selection.length === 0"
          style="margin-bottom: 15px"
        >批量删除</el-button>

         <!-- 过滤框 -->
         <el-collapse-transition>
          <div v-if="show" style="background-color: white; height: 100px; box-sizing: border-box">
            <el-form ref="form" :model="form" label-width="80px">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="学年：">
                    <el-select v-model="form.year" style="width: 90%">
                      <el-option v-for="item in yearArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="学期：">
                    <el-select v-model="form.term" style="width: 90%">
                      <el-option v-for="item in termArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="专业：" prop="profession">
                    <el-select v-model="form.professionObj" style="width: 90%" @change="professionChange" value-key="profession">
                      <el-option v-for="item in classArr" :key="item.profession" :label="item.profession" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="类别：" prop="grade">
                    <el-select v-model="form.grade" style="width: 90%">
                      <el-option v-for="(item, index) in categoryOptions" :key="index" :label="item" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="课程名：" prop="courseName">
                    <el-select v-model="form.courseName" style="width: 90%">
                      <el-option v-for="item in courseArr" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="text-align: right;">
                  <el-button type="primary" @click="clickAndClose" size="small" style="margin-right: 10px">确定并关闭</el-button>
                  <el-button type="primary" @click="clickSure" size="small" style="margin-right: 10px">确定</el-button>
                  <el-button size="small" @click="cancel" style="margin-right: 500px">取消</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-collapse-transition>
  
        <!-- 数据表格 -->
        <!-- <VmBaseTable
          :setTableHigh="true"
          ref="score_table"
          :data="dataTable"
          :columns="dataColumns"
          @page-change="pageChange"
          @on-select-change="selectChange"
          showCheck
          :tableHigh="tableHigh"
          @selection-change="selectChange"
        > -->
          <!-- 定义操作列的插槽 -->
          <!-- <template #operation="{ row }">
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(row)"   
            >删除</el-button>
          </template>
        </VmBaseTable> -->
        <template>
          <el-table :data="tableData" style="width: 100%" height="250">
            <el-table-column fixed prop="date" label="Date" width="150" />
            <el-table-column prop="name" label="Name" width="120" />
            <el-table-column prop="state" label="State" width="120" />
            <el-table-column prop="city" label="City" width="320" />
            <el-table-column prop="address" label="Address" width="600" />
            <el-table-column prop="zip" label="Zip" />
          </el-table>
        </template>
      
      
      
      
      
      
      
      
      
      
      </el-card>
        <!-- 隐藏的文件输入元素用于成绩录入 -->
      <input
        ref="fileInput"
        type="file"
        accept=".xls,.xlsx"
        style="display: none;"
        @change="handleFileUpload"
        multiple
      />
    </div>
</template>


<script setup>
//导入区
import axios from 'axios'
import {ref} from 'vue'



//表格处理部分
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-08',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-06',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-07',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
]





//



//定义区
const loading=ref(false)
//管理文件筐打开
const fileInput=ref(null)
const courseArr=ref(['数据结构', '操作系统', '数据库系统'])
const classArr=ref(['计算机科学 2021', '计算机科学 2022', '软件工程 2021'])
const professionArr=ref(['计算机科学', '软件工程', '信息技术'])
const gradeArr=ref(['计算机科学 2021', '计算机科学 2022', '软件工程 2021'])
const professionObj=ref('')
const batch=ref(false)
const showInput=ref('')
const show=ref(false)
const form=ref({
        profession: '',
        grade: '',
        term: '',
        courseName: '',
        year: '',
        student_name: '',
        major: '',
})
const yearArr=ref([
            { label: '2021', value: 2021 },
            { label: '2022', value: 2022 },
            { label: '2023', value: 2023 }
          ])
const termArr=ref([
            { label: '上学期', value: 1 },
            { label: '下学期', value: 2 }
          ])

const searchValue=ref({
            $limit: 10,
            $offset: 0,
          })

const selection=ref([])
const dataTable=ref([])
const baseColumns=ref([
{ label: '学生姓名', prop: 'student_name', style: 'center', minWidth: '100' },
{ label: '专业', prop: 'major', style: 'center', minWidth: '100' },
])
const categoryColumnsMap=ref({
            '春季必修学分': { label: '春季必修学分', prop: 'spring_required_credits', style: 'center', minWidth: '130' },
            '秋季必修学分': { label: '秋季必修学分', prop: 'autumn_required_credits', style: 'center', minWidth: '130' },
            '春季核心课程学分': { label: '春季核心课程学分', prop: 'spring_core_credits', style: 'center', minWidth: '150' },
            '秋季核心课程学分': { label: '秋季核心课程学分', prop: 'autumn_core_credits', style: 'center', minWidth: '150' },
            '数字逻辑学分': { label: '数字逻辑学分', prop: 'numerical_logic_credits', style: 'center', minWidth: '120' },
            '春季限选学分': { label: '春季限选学分', prop: 'spring_limited_credits', style: 'center', minWidth: '130' },
            '秋季限选学分': { label: '秋季限选学分', prop: 'autumn_limited_credits', style: 'center', minWidth: '130' },
            '企业实训/专业实践': { label: '企业实训/专业实践', prop: 'short_term_training_credits', style: 'center', minWidth: '200' },
            '国际化课程学分': { label: '国际化课程学分', prop: 'international_credits', style: 'center', minWidth: '150' },
            '专业选修学分': { label: '专业选修学分', prop: 'elective_credits', style: 'center', minWidth: '130' },
            '外专业学分': { label: '外专业学分', prop: 'outmajor_credits', style: 'center', minWidth: '120' },
            '素质核心学分': { label: '素质核心学分', prop: 'culture_core_credits', style: 'center', minWidth: '130' },
            '素质选修学分': { label: '素质选修学分', prop: 'culture_choose_credits', style: 'center', minWidth: '130' },
            '创新创业学分': { label: '创新创业学分', prop: 'innovation_credits', style: 'center', minWidth: '130' },
          })

const operationColumn=ref({
            label: '操作',
            prop: 'operation',
            style: 'center',
            minWidth: '100',
            slot: 'operation',
          })

const dataColumns=ref([])
//函数声明区
const change=()=>{
    show.value=!show.value
    console.log(show.value)
}
//点击打开文件选择框
const addEntry=()=>{
    fileInput.value.click()
}
//
//处理文件选择
const handleFileUpload = async (event) => {
    const files = event.target.files
    if (files.length === 0) {
      ElMessage.warning('请选择要上传的文件')
      return
    }
  
    // 创建 FormData 对象
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]) // 添加多个文件
    }
  
    // 添加额外的表单字段
    formData.append('student_name', form.value.student_name)
    formData.append('major', form.value.major)
  
    try {
      // 发送文件到后端
      const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    
      ElMessage.success('文件上传成功')
      // 可以在这里执行成功后的其他操作，例如刷新数据
      fetchData()
    } catch (error) {
      console.error('文件上传失败:', error)
      ElMessage.error('文件上传失败')
    }
}

const fetchData = async (page = 1) => {
  loading.value = true
  try {
    const response = await axios.get('http://127.0.0.1:5000/data', {
      params: { page, ...form.value }
    })
    dataTable.value = response.data
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}
</script>



<style scoped>
.cardStyle {
  height: 78vh;
  margin: 10px;
  padding: 15px 10px 10px 10px;
}
</style>