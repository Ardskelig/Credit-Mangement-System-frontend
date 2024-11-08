<template>
  
    <div>
        <el-card class="cardStyle" v-loading="loading" > 
          <!-- <button @click="buttonclick">点击</button>  -->
          <!-- 上方功能按钮部分 -->
          <el-button @click="ifShow"  type="primary" style="margin-bottom: 10px">打开/关闭筛选栏</el-button>
          <!-- <el-button @click="batchMethod" type="info" size="small" :disabled="dataTable.length <= 0" style="margin-bottom: 15px">批量编辑</el-button> -->
          <el-button @click="addEntry" type="primary"  style="margin-bottom: 10px">导入excel</el-button>
          <el-button @click="DeleteAllData" type="danger"  style="margin-bottom: 10px">删除所有数据</el-button>
          <!-- <el-button @click="exportMethod" type="success" :disabled="dataTable.length <= 0" size="small" style="margin-bottom: 15px">导出</el-button> -->
          <!-- <el-button
            @click="batchDelete"
            type="danger"
            size="small"
            :disabled="selection.length === 0"
            style="margin-bottom: 15px"
          >批量删除</el-button> -->

          <!-- 过滤框 -->
            <el-collapse-transition>
              <div v-if="show" style="background-color: white; height: 100px; box-sizing: border-box">
                <el-form :model="SelectForm" label-width="100px">
                  <el-row>
                    <el-col :span="16">
                      <el-form-item label="课程类别">
                        <el-select v-model="SelectForm.typeSelected" multiple collapse-tags collapse-tags-tooltip style="width: 90%" placeholder="选择课程类别">
                          <el-option v-for="item in typeArr" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2" >
                      <el-button type="primary" plain :icon="SuccessFilled" @click="selectAllType">选择全部</el-button>
                    </el-col>
                    <el-col :span="2" >
                      <el-button type="warning" plain :icon="CircleClose" @click="cancelAllType">取消全部</el-button>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="16">
                      <el-form-item label="专业：">
                        <el-select v-model="SelectForm.majors" multiple collapse-tags collapse-tags-tooltip style="width: 90%"  placeholder="选择对应专业">
                          <el-option v-for="item in majorArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2" >
                      <el-button type="primary" plain :icon="SuccessFilled" @click="selectAllMajor">选择全部</el-button>
                    </el-col>
                    <el-col :span="2" >
                      <el-button type="warning" plain :icon="CircleClose" @click="cancelAllMajor">取消全部</el-button>
                    </el-col>
                    <!-- <el-col :span="2" >
                      <el-button type="primary" :icon="Search">筛选</el-button>
                    </el-col> -->
                  </el-row>
                </el-form>
              </div>
            </el-collapse-transition>



            <!-- 表格部分 -->
            <!-- <el-table 
                :data="filteredStudentData" 
                border  
                style="width: 100%" 
                height="700" 
                :cell-style="cellStyle"
                @row-click="handleRowClick"
            >
                <el-table-column fixed type="index" label="序号" width="60" />
                <el-table-column fixed prop="student_name" label="学生姓名" width="100" />
                <el-table-column fixed prop="student_id" label="学号" width="120" />
                <el-table-column fixed prop="major" label="专业" width="120" />
                <el-table-column prop="spring_required_credits.value" label="春季必修" width="120" />
                <el-table-column prop="spring_limited_credits.value" label="春季限选" width="120" />
                <el-table-column prop="spring_core_credits.value" label="春季核心" width="120" />

                <el-table-column prop="autumn_required_credits.value" label="秋季必修" width="120" />
                <el-table-column prop="autumn_limited_credits.value" label="秋季限选" width="120" />
                <el-table-column prop="autumn_core_credits.value" label="秋季核心" width="120" />

                <el-table-column prop="short_term_training_credits.value" label="企业短期实训" width="120" />
                <el-table-column prop="outmajor_credits.value" label="外专业课程" width="120" />
                <el-table-column prop="numerical_logic_credits.value" label="数字逻辑" width="120" />
                <el-table-column prop="international_credits.value" label="国际化课程" width="120" />
                <el-table-column prop="innovation_credits.value" label="创新学分" width="120" />
                <el-table-column prop="elective_credits.value" label="专业选修" width="120" />

                <el-table-column prop="culture_choose_credits.value" label="文化素质选修" width="120" />
                <el-table-column prop="culture_core_credits.value" label="文化素质核心" width="120" />
                <el-table-column prop="culture_total_credits.value" label="文化素质总分" width="120" />
                <el-table-column fixed="right" min-width="160">
                  <template #header>
                    <el-input v-model="searchQuery"  placeholder="搜索姓名或学号" />
                  </template>
                    <template #default="scope">
                      <el-button  type="primary"  @click="handleRowClick">
                        查看详情
                      </el-button>
                    </template>
                </el-table-column>
            </el-table> -->
            <!-- 改为动态渲染 -->
          <el-table 
                :data="filteredStudentData" 
                border  
                style="width: 100%" 
                height="700" 
                stripe
                :cell-style="cellStyle"
                @row-click="handleRowClick"
              >
                <el-table-column fixed type="index" label="序号" width="60" />
                <el-table-column fixed prop="student_name" label="学生姓名" width="100" />
                <el-table-column fixed prop="student_id" label="学号" width="120" />
                <el-table-column fixed prop="major" label="专业" width="120" />

                <!-- 动态渲染学分类型列 -->
                <template v-for="type in SelectForm.typeSelected" :key="type">
                  <el-table-column 
                    v-if="filteredStudentData.length > 0 && type in filteredStudentData[0]"
                    :prop="type" 
                    :label="typeArr.find(item => item.value === type).label" 
                    width="120"
                    :formatter="(row) => row[type].value" 
                  />
                </template>
              
                <el-table-column fixed="right" min-width="160">
                  <template #header>
                    <el-input v-model="searchQuery" placeholder="搜索姓名或学号" />
                  </template>
                  <template #default="scope">
                    <el-button type="primary" @click="handleRowClick(scope.row)">
                      查看详情
                    </el-button>
                  </template>
                </el-table-column>
            </el-table>


            <el-dialog v-model="dialogTableVisible" width="500">
                <el-descriptions
                  title="学生学分具体信息"
                  direction="vertical"
                  border
                  style="margin-top: 20px"
                >
                  <el-descriptions-item label="学生姓名">{{ studata.student_name }}</el-descriptions-item>
                  <el-descriptions-item label="专业">{{ studata.major }}</el-descriptions-item>
                  <!-- <el-descriptions-item label="Place">Suzhou</el-descriptions-item> -->
                  <el-descriptions-item label="学号">
                    <el-tag size="small">{{ studata.student_id }}</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="缺少课程">
                    <ul>
                      <li v-for="(course, index) in missingCourses" :key="index">{{ course }}</li>
                    </ul>
                  </el-descriptions-item>
                </el-descriptions>  
                <template #footer>
                  <div class="dialog-footer">
                    <el-button @click="dialogTableVisible = false">关闭</el-button>
                    <el-button type="primary" @click="dialogTableVisible = false">
                      确认
                    </el-button>
                  </div>
                </template>
            </el-dialog>
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
import { courseTemplate } from './template.js'
import { ElMessageBox, ElMessage } from 'element-plus';
import { h } from 'vue'
import { ElNotification, valueEquals } from 'element-plus'
import { Search,SuccessFilled,CircleClose } from '@element-plus/icons-vue'
// import { ElMessage } from 'element-plus'
import { onMounted, ref ,computed } from 'vue'
import axios from 'axios';
import {ElLoading } from 'element-plus'

const url = "http://127.0.0.1:5000";
const loading = ref(true);


//***表格部分***//
// 表格数据
const student_data=ref([
  {
    "autumn_core_credits":{
      value:0.0,
      isOk:false
    },
    
    "autumn_limited_credits": {
      value:0.0,
      isOk:false
    },
    "autumn_required_credits":{
      value:59.0,
      isOk:false
    },
    "culture_choose_credits": {
      value:5.5,
      isOk:false
    },
    "culture_core_credits": {
      value:5.0,
      isOk:false
    },
    "culture_total_credits": {
      value:11.5,
      isOk:false
    },
    "elective_credits": {
      value:10.0,
      isOk:false,
    },
    // "id": 108,
    "student_id":202216545,
    "innovation_credits": {
      value:3.0,
      isOk:false
    },
    "international_credits": {
      value:1.0,
      isOk:false
    },
    "major": "未命名专业",
    "numerical_logic_credits": {
      value:3.0,
      isOk:false
    },
    "outmajor_credits": {
      value:7.0,
      isOk:false
    },
    "short_term_training_credits": {
      value:2.0,
      isOk:false
    },
    "spring_core_credits": {
      value:0.0,
      isOk:false
    },
    "spring_limited_credits": {
      value:4.0,
      isOk:false
    },
    "spring_required_credits": {
      value:0.0,
      isOk:false
    },
    "student_name": "大数据1"
  }
])
const tableData = ref([
  {
    "autumn_core_credits": 0.0,
    "autumn_limited_credits": 0.0,
    "autumn_required_credits": 59.0,
    "culture_choose_credits": 5.5,
    "culture_core_credits": 5.0,
    "culture_total_credits": 11.5,
    "elective_credits": 10.0,
    "id": 108,
    "innovation_credits": 3.0,
    "international_credits": 1.0,
    "major": "未命名专业",
    "numerical_logic_credits": 3.0,
    "outmajor_credits": 7.0,
    "short_term_training_credits": 2.0,
    "spring_core_credits": 0.0,
    "spring_limited_credits": 4.0,
    "spring_required_credits": 0.0,
    "student_name": "大数据1"
  },
]);

//数据转化处理函数
// 定义一个处理函数，将 res.data 转换为所需格式
function processStudentData(data) {
  return data.map(item => ({
    autumn_core_credits: {
      value: item.autumn_core_credits,
      isOk: true
    },
    autumn_limited_credits: {
      value: item.autumn_limited_credits,
      isOk: false
    },
    autumn_required_credits: {
      value: item.autumn_required_credits,
      isOk: true
    },
    culture_choose_credits: {
      value: item.culture_choose_credits,
      isOk: false
    },
    culture_core_credits: {
      value: item.culture_core_credits,
      isOk: true
    },
    culture_total_credits: {
      value: item.culture_total_credits,
      isOk: false
    },
    elective_credits: {
      value: item.elective_credits,
      isOk: true
    },
    // id: item.id,
    student_id: item.student_id,  // 如果需要的话，可以从 API 返回的数据中添加 student_id
    innovation_credits: {
      value: item.innovation_credits,
      isOk: false
    },
    international_credits: {
      value: item.international_credits,
      isOk: true
    },
    major: item.major,
    numerical_logic_credits: {
      value: item.numerical_logic_credits,
      isOk: false
    },
    outmajor_credits: {
      value: item.outmajor_credits,
      isOk: false
    },
    short_term_training_credits: {
      value: item.short_term_training_credits,
      isOk: false
    },
    spring_core_credits: {
      value: item.spring_core_credits,
      isOk: false
    },
    spring_limited_credits: {
      value: item.spring_limited_credits,
      isOk: false
    },
    spring_required_credits: {
      value: item.spring_required_credits,
      isOk: false
    },
    student_name: item.student_name,
    // student_id:item.student_id
  }))
}


// 获取数据
const getTableData = () => {
  axios.get(url + '/data')
    .then(res => {
      console.log(res);
      student_data.value=processStudentData(res.data)
      loading.value=false
    }).catch((error) => {
      console.log(error);
    });
}

onMounted(() => {
  console.log("标准数据",courseTemplate)
  SelectForm.value.typeSelected = typeArr.value.map(item => item.value)
  loading.value=true
  getTableData();
});

// 根据单元格值设置红色背景
const cellStyle = ({ row, column }) => {
  // 更新列名以匹配包含 .value 的属性
  const creditColumns = [
  'spring_required_credits',
  'spring_limited_credits',
  'spring_core_credits',
  'autumn_required_credits', 
  'autumn_limited_credits', 
  'autumn_core_credits', 
  'short_term_training_credits',
  'outmajor_credits',
  'numerical_logic_credits',
  'international_credits',
  'innovation_credits',
  'elective_credits',
  'culture_choose_credits',
  'culture_core_credits',
  'culture_total_credits'
];


  // 使用 column.property 检查是否在 creditColumns 中
  if (creditColumns.includes(column.property) && row[column.property.split('.')[0]].value <0) {
    return { backgroundColor: '#ffcccc', color: '#d9534f' }; // 红色背景与红色字体
  }
  
  return {};
}

//每一行绑定事件，具体信息
const studata=ref({})//具体信息显示部分，之后绑定axios发送请求获得
const missingCourses=ref([
      "PjBL与科技创新",
      "专业解读",
      "军事技能",
      "大学计算机-计算思维导论D",
      "形势与政策(3)",
      "操作系统",
      "数据库系统",
      "毕业设计（论文）",
      "编译原理",
      "计算机网络",
      "软件工程",
      "集合论与图论",
      "高级语言程序设计"
])
const dialogTableVisible=ref(false)
//处理点击，然后发送数据
const handleRowClick = (row) => {
    dialogTableVisible.value = true;
    console.log(row);
    studata.value = row;

    // 提取 student_name, student_id, major
    const { student_name, student_id, major } = studata.value;

    // 生成要发送的数据 
    const dataToSend = { 
        student_name, 
        student_id,
        major,
        course_type: [] // 用于存储 isOk 为 false 的学分名
    };

    // 遍历 studata.value 的每个属性
    for (const [key, value] of Object.entries(studata.value)) {
        if (key === 'spring_limited_credits' || key == 'spring_required_credits' || key === 'spring_core_credits'||
            key === 'autumn_limited_credits' || key == 'autumn_required_credits' || key === 'autumn_core_credits' && value.value <0) {
            // 如果 isOk 为 false，添加到 course_type 数组中
            dataToSend.course_type.push(key);
        }
    }

    console.log("需要发送的数据如下:", dataToSend);

    // 如果有需要发送的数据，调用发送函数
    if (dataToSend.course_type.length > 0) {
        sendDataToBackend(dataToSend);
    }
};

// 发送数据到后端的函数
const sendDataToBackend = async (data) => {
    try {
        const response = await axios.post(url+'/check_missing_courses', data); // 更改为你的后端接口
        console.log('数据发送成功:', response.data);
        missingCourses.value=response.data
        ElMessage({
        message: '数据获取成功',
        type: 'success',
      });
        // 在这里处理后端返回的数据（例如，显示消息、更新状态等）
    } catch (error) {
        console.error('数据发送失败:', error);
        ElMessage({
        message: '数据获取失败',
        type: 'error',
      });
        // 在这里处理错误（例如，显示错误消息）
    }
};

//********//



//***表格上方按钮部分***//
//1. 文件处理、上传等
//点击打开文件选择框
const addEntry=()=>{
    fileInput.value.click()
}
//
//处理文件选择
//form表单专门用于文件上传处理
const form=ref({
            profession: '',
            grade: '',
            term: '',
            courseName: '',
            year: '',
            student_name: '',
            major: '',
          })
const fileInput=ref(null)


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

    // 启动加载动画
    const loading = ElLoading.service({
        lock: true,
        text: '数据正在飞速上传和处理......',
        background: 'rgba(0, 0, 0, 0.7)'
    })

    try {
        // 发送文件到后端
        const response = await axios.post(url+'/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        ElNotification({
            title: '提示信息',
            message: h('i', { style: 'color: teal' }, '文件上传成功'),
        })

        // 可以在这里执行成功后的其他操作，例如刷新数据
        getTableData()
    } catch (error) {
        console.error('文件上传失败:', error)
        ElNotification({
            title: 'Error',
            message: '文件上传失败',
            type: 'error',
        })
    } finally {
        // 关闭加载动画
        loading.close()
    }
}

//2.筛选功能
const show=ref(false)
const ifShow=()=>{
  show.value=!show.value
  console.log(show.value)
}
//各种选择，最终选择的结果在SelectForm中存储
const SelectForm=ref({
        majors: [],//专业
        typeSelected:[]//这个数组用来存储选择的不同种类学分的类别
})


// const typeSelected=ref([])
const typeArr=ref([
  {
    label:'春季必修',
    value:"spring_required_credits"
  },
  {
    label:'春季限选',
    value:"spring_limited_credits"
  },
  {
    label:'春季核心',
    value:"spring_core_credits"
  },
  {
    label:"秋季必修",
    value:"autumn_required_credits"
  },
  {
    label:"秋季限选",
    value:"autumn_limited_credits"
  },
  {
    label:"秋季核心",
    value:"autumn_core_credits"
  },
  {
    label:"企业短期实训",
    value:"short_term_training_credits"
  },
  {
    label:"外专业课程",
    value:"outmajor_credits"
  },
  {
    label:"数字逻辑",
    value:"numerical_logic_credits"
  },
  {
    label:"国际化课程",
    value:"international_credits"
  },
  {
    label:"创新学分",
    value:"innovation_credits"
  },
  {
    label:"专业选修",
    value:"elective_credits"
  },
  {
    label:"文化素质选修",
    value:"culture choose_credits"
  },
  {
    label:"文化素质核心",
    value:"culture_core_credits"
  },
  {
    label:"文化素质总分",
    value:"culture_total_credits"
  }
])
const selectAllType=()=>{
  // 清空当前选择
  SelectForm.value.typeSelected = [];
  
  // 将 typeArr 中的每个 value 添加到 typeSelected 中
  SelectForm.value.typeSelected = typeArr.value.map(item => item.value);
}
const cancelAllType=()=>{
  // 清空当前选择
  SelectForm.value.typeSelected = [];
}
const majorArr=ref([
  {
    value:"计算机科学与技术",
    label:"计算机科学与技术",
  },
  {
    value:"数据科学与大数据技术",
    label:"数据科学与大数据技术"
  },
  {
    value:"人工智能",
    label:"人工智能"
  },
  {
    value:"网络空间安全",
    label:"网络空间安全"
  },
  {
    value:"信息安全",
    label:"信息安全"
  },
  {
    value:"软件工程",
    label:"软件工程"
  },
  {
    value:"物联网工程",
    label:"物联网工程"
  },
  {
    value:"生物信息学",
    label:"生物信息学"
  }
])
const selectAllMajor=()=>{
  SelectForm.value.majors=[]
  SelectForm.value.majors=majorArr.value.map(item=>item.value)
}
const cancelAllMajor=()=>{
  // 清空当前选择
  SelectForm.value.majors=[]
}

//3.搜索功能
// 搜索关键字
const searchQuery = ref("");
// 计算属性：根据搜索关键字过滤数据
const filteredStudentData = computed(() => {
  // 如果没有搜索关键字，显示所有数据
  let filteredData = student_data.value;

  // 过滤逻辑：根据姓名或学号包含搜索关键字
  if (searchQuery.value) {
    filteredData = filteredData.filter((student) => {
      return (
        student.student_name.includes(searchQuery.value) ||
        student.student_id.toString().includes(searchQuery.value)
      );
    });
  }

  // 根据 SelectForm 进行筛选
  if (SelectForm.value.typeSelected.length > 0) {
    filteredData = filteredData.map((student) => {
      // 只保留选中的学分字段
      let filteredStudent = {
        student_name: student.student_name,
        student_id: student.student_id,
        major: student.major,
      };

      SelectForm.value.typeSelected.forEach((type) => {
        // 确保该字段存在于学生对象中
        if (type in student) {
          filteredStudent[type] = student[type]; // 直接添加整个学分对象
        }
      });

      return filteredStudent;
    });
  }


  // 根据专业进行筛选
  if (SelectForm.value.majors.length > 0) {
    filteredData = filteredData.filter((student) => {
      return SelectForm.value.majors.includes(student.major); // 只保留所选专业的学生
    });
  }

  return filteredData;
});


//4.删除功能
const DeleteAllData = async () => {
  try {
    // 弹出确认框
    await ElMessageBox.confirm('您确定要删除所有数据吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    // 启动加载动画
    const loading = ElLoading.service({
      lock: true,
      text: '数据删除中...',
      background: 'rgba(0, 0, 0, 0.7)',
    })

    try {
      // 发送删除请求
      const response = await axios.get(url + '/delete_all_student_tables') // 替换为实际的后端接口

      ElMessage({
        message: '数据已成功删除',
        type: 'success',
      })
      console.log(response.data) // 处理后端返回的数据

      // 删除成功后刷新页面
      location.reload()
    } catch (error) {
      ElMessage({
        message: '删除数据失败，请重试',
        type: 'error',
      })
      console.error(error)
    } finally {
      // 关闭加载动画
      loading.close()
    }
  } catch {
    // 用户取消了删除操作，无需任何操作
    ElMessage({
      message: '已取消删除操作',
      type: 'info',
    })
  }
}



const buttonclick=()=>{
  console.log(SelectForm.value)
}
</script>

<style scoped>
.cardStyle {
  height: 100%;
  margin: 5px;
  padding: 10px 10px 10px 10px;
}
</style>
