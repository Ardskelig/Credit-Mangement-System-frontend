<template>
  <div class="container">
    <div>
        <el-card class="cardStyle" v-loading="loading" > 

          <!-- 上方功能按钮部分 -->
          <el-button @click="ifShow"  type="primary" style="margin-bottom: 10px">打开/关闭筛选栏</el-button>
          <!-- <el-button @click="batchMethod" type="info" size="small" :disabled="dataTable.length <= 0" style="margin-bottom: 15px">批量编辑</el-button> -->
          <el-button @click="addEntry" type="primary"  style="margin-bottom: 10px">导入excel</el-button>
          <el-button @click="IfExport=true" type="primary"  style="margin-bottom: 10px">将目前的表格导出为excel</el-button>
          <el-button type="primary" plain style="margin-bottom: 10px"><strong>当前总人数:{{ filteredCount }}</strong></el-button>
          <el-button type="success"  style="margin-bottom: 10px" @click="centerDialogVisible = true;console.log(filteredStudentData)">查看统计图</el-button>
          <!-- <el-button type="primary" plain style="margin-bottom: 10px" @click="console.log(SelectForm)">点击以console.log</el-button> -->
          <!-- 过滤框 -->
            <el-collapse-transition>
              <div v-if="show" style="background-color: white; height: 50px; box-sizing: border-box">
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
                    <el-col :span="3" >
                    <el-switch
                      v-model="isLackCredit"
                      size="large"
                      active-text="只看缺少学分"
                      inactive-text=""
                      style="margin-bottom: 10px"
                    />
                    </el-col>
                  </el-row>

                </el-form>
              </div>
            </el-collapse-transition>

            <!-- 表格部分 -->
            <!-- 改为动态渲染 -->
             
          <el-table 
                :data="filteredStudentData" 
                border  
                style="width: 100%" 
                height="800px" 
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
                  <!--筛选部分,只有在typeSelected数组中的元素才会被渲染-->
                  <el-table-column 
                    v-if="filteredStudentData.length > 0 && type in filteredStudentData[0]" 
                    :prop="type" 
                    :label="typeArr.find(item => item.value === type).label" 
                    width="120"
                    :formatter="row => formatCell(row, type)"
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

            <!-- 是否导出为excel提示窗 -->
            <el-dialog v-model="IfExport" title="消息提示" width="800">
              确定要将目前删选的表格导出为excel？
              <template #footer>
                <div class="dialog-footer">
                  <el-button @click="IfExport = false">取消</el-button>
                  <el-button type="primary" @click="exportToExcel">
                    确定
                  </el-button>
                </div>
              </template>
            </el-dialog>
            <!-- 详细信息提示窗 -->
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
                    <el-tag size="large">{{ studata.student_id }}</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="缺少课程">
                    <template v-for="(courses, category) in missingCourses" :key="category">
                       <div style="margin-bottom: 10px;">
                         <strong>{{ category }}</strong>
                       </div>
                       <!-- 使用 ul/li 结构渲染课程列表 -->
                        <ul style="padding-left: 20px; list-style-type: disc; margin-top: 5px;">
                          <li v-for="course in courses" :key="course" style="margin-bottom: 5px;">
                            {{ course }}
                          </li>
                        </ul>
                     </template>
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
            <!-- echarts统计图显示窗 -->
            <el-dialog
              v-model="centerDialogVisible"
              title="学分整体情况图"
              width="65%"
              destroy-on-close
            >
            <div style="display: flex; justify-content: center; align-items: center; padding: 0px;">
              <!-- 这里可以调整 e-charts 的宽高 -->
              <e-charts class="chart" :option="option" :style="{ width: '1000px', height: '700px' }" @click="handleChartClick"></e-charts>
            </div>

            <!-- 显示点击类别的学生列表 -->
            <div v-if="selectedCategory" style="padding: 0px;">
              <h3>{{ selectedCategory }} 学生列表</h3>
              <el-table :data="studentsForCategory" style="width: 100%">
                 <el-table-column prop="name" label="学生姓名"></el-table-column>
                 <el-table-column prop="id" label="学号"></el-table-column>
                 <el-table-column prop="major" label="专业"></el-table-column>
                 <el-table-column prop="credits" label="所差学分"></el-table-column>
                 <!-- 仅在选中的类别是文化素质学分时显示 MOOC 列 -->
                 <el-table-column
                   v-if="showMoocColumn"
                   prop="mooc"
                   label="慕课情况">
                 </el-table-column>
              </el-table>
              
            </div>
              <template #footer>
                <div class="dialog-footer">
                  <el-button type="primary" @click="centerDialogVisible = false">
                    关闭
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
  </div>
</template>

<script setup>
import { courseTemplate } from './template.js'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ElMessageBox, ElMessage } from 'element-plus';
import "echarts"
import { h } from 'vue'
import { ElNotification, valueEquals } from 'element-plus'
import { Search,SuccessFilled,CircleClose } from '@element-plus/icons-vue'
// import { ElMessage } from 'element-plus'
import { onMounted, ref ,computed,watch } from 'vue'
import axios from 'axios';
import {ElLoading } from 'element-plus'
import * as echarts from 'echarts';
// 引入echarts组件
// import PieChart from '@/components/charts.vue';

const isLackCredit = ref(false)//开关，是否只看差学分的学生
const filteredCount=ref(0)//计算当前筛选结果的总数

const url = "http://127.0.0.1:5000";
const loading = ref(true);


//***表格部分***//
// 表格数据
const student_data=ref([
  {
        
        "autumn_required_credits": 54.0,
        "core_credits": 13.0,
        "culture_choose_credits": 1.5,
        "culture_core_credits": 4.0,
        "elective_credits": 6.5,
        "innovation_credits": 6.0,
        "international_credits": 4.0,
        "limited_credits": 4.0,
        "major": "计软网信物人医",
        "numerical_logic_credits": 3.0,
        "outmajor_credits": 0.0,
        "short_term_training_credits": 0.0,
        "spring_required_credits": 43.0,
        "student_id": "114514",
        "student_name": "2333",
        "MOOC": [
            1.0,
            3.0,
            1.5,
            2.5,
            2.0
        ],
    },
])

// 通用的 formatter 函数,用于处理mooc和其他属性渲染的问题
const formatCell = (row, type) => {
  const cell = row[type];
  if (Array.isArray(cell)) {
    return cell.join(', ');
  } else if (cell && typeof cell === 'object' && 'value' in cell) {
    return cell.value;
  } else {
    return cell;
  }
};


//数据转化处理函数
// 定义一个处理函数，将 res.data 转换为所需格式
// function processStudentData(data) {
//   return data.map(item => ({
//     core_credits: {
//       value: item.core_credits,
//       isOk: true
//     },
//     limited_credits: {
//       value: item.limited_credits,
//       isOk: false
//     },
//     autumn_required_credits: {
//       value: item.autumn_required_credits,
//       isOk: true
//     },
//     culture_choose_credits: {
//       value: item.culture_choose_credits,
//       isOk: false
//     },
//     culture_core_credits: {
//       value: item.culture_core_credits,
//       isOk: true
//     },
//     culture_total_credits: {
//       value: item.culture_total_credits,
//       isOk: false
//     },
//     elective_credits: {
//       value: item.elective_credits,
//       isOk: true
//     },
//     // id: item.id,
//     student_id: item.student_id,  // 如果需要的话，可以从 API 返回的数据中添加 student_id
//     innovation_credits: {
//       value: item.innovation_credits,
//       isOk: false
//     },
//     international_credits: {
//       value: item.international_credits,
//       isOk: true
//     },
//     major: item.major,
//     numerical_logic_credits: {
//       value: item.numerical_logic_credits,
//       isOk: false
//     },
//     outmajor_credits: {
//       value: item.outmajor_credits,
//       isOk: false
//     },
//     short_term_training_credits: {
//       value: item.short_term_training_credits,
//       isOk: false
//     },
//     spring_core_credits: {
//       value: item.spring_core_credits,
//       isOk: false
//     },
//     spring_limited_credits: {
//       value: item.spring_limited_credits,
//       isOk: false
//     },
//     spring_required_credits: {
//       value: item.spring_required_credits,
//       isOk: false
//     },
//     student_name: item.student_name,
//     // student_id:item.student_id
//   }))
// }


// 获取数据
const getTableData = () => {
  axios.get(url + '/data')
    .then(res => {
      console.log(res);
      // student_data.value=processStudentData(res.data)
      student_data.value=res.data
      console.log("所有学生的数据:",student_data.value)
      loading.value=false
    }).catch((error) => {
      console.log(error);
      loading.value=false
      alert("服务异常")
    });
}

//各种选择，最终选择的结果在SelectForm中存储
const SelectForm=ref({
        majors: [],//专业,目前准备取消
        typeSelected:[]//这个数组用来存储选择的不同种类学分的类别
})
// const typeSelected=ref([])
const typeArr=ref([

  {
    label:'春季必修',
    value:"spring_required_credits"
  },
  {
    label:"秋季必修",
    value:"autumn_required_credits"
  },
  {
    label:'专业限选',
    value:"limited_credits"
  },
  {
    label:'专业核心',
    value:"core_credits"
  },
  {
    label:"专业选修",
    value:"elective_credits"
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
    label:"文化素质选修",
    value:"culture_choose_credits"
  },
  {
    label:"文化素质核心",
    value:"culture_core_credits"
  },
  {
    label:'慕课',
    value:"MOOC"
  },
])
onMounted(() => {
  console.log("标准数据",courseTemplate)
  SelectForm.value.typeSelected = typeArr.value.map(item => item.value)
  console.log("selectForm 里面选择的学分类别：",SelectForm.value.typeSelected)
  loading.value=true
  getTableData();
});

// 根据单元格值设置红色背景
const creditColumns =new Set([
  'spring_required_credits',
  'limited_credits',
  'core_credits',
  'autumn_required_credits', 
  // 'autumn_limited_credits', 
  // 'autumn_core_credits', 
  'short_term_training_credits',
  'outmajor_credits',
  'numerical_logic_credits',
  'international_credits',
  'innovation_credits',
  'elective_credits',
  'culture_choose_credits',
  'culture_core_credits',
  // 'culture_total_credits'
]);
const cellStyle = ({ row, column }) => {
  // 更新列名以匹配包含 .value 的属性
  // 使用 column.property 检查是否在 creditColumns 中
  if (creditColumns.has(column.property) && row[column.property] < 0) {
    return { backgroundColor: '#ffcccc', color: '#d9534f' };
  }
  return {};
}

//每一行绑定事件，具体信息
const studata=ref({})//具体信息显示部分，之后绑定axios发送请求获得
const missingCourses=ref({
"专业必修课": [ 
  "军事技能", 
  "形势与政策(3)", 
  "操作系统", 
  "数据库系统", 
  "毕业设计（论文）", 
  "算法设计与分析", 
  "编译原理", 
  "计算机系统", 
  "计算机网络", 
  "软件工程" ],

  "专业核心课": [ 
  "处理器设计与实践", 
  "计算机体系结构A", 
  "计算机科学/计算机工程专业方向实践", 
  "计算系统设计与实现" 
  ]
})
const size = ref('medium'); // 可根据需要修改尺寸
const blockMargin = { margin: '20px 0' };
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
        if (key === 'imited_credits' || key == 'spring_required_credits' || key === 'core_credits'||
            key == 'autumn_required_credits' && value.value <0) {
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




const selectAllType=()=>{
  // 清空当前选择
  SelectForm.value.typeSelected = [];
  
  // 将 typeArr 中的每个 value 添加到 typeSelected 中
  SelectForm.value.typeSelected = typeArr.value.map(item => item.value);

  console.log("所有的选择：",SelectForm.value.typeSelected)
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
      // console.log("打印出来最终的筛选结果：",filteredStudent)
      return filteredStudent;
      
    });
  }


  // 根据专业进行筛选
  if (SelectForm.value.majors.length > 0) {
    filteredData = filteredData.filter((student) => {
      return SelectForm.value.majors.includes(student.major); // 只保留所选专业的学生
    });
  }

  //根据是否选择“只看缺少学分筛选”
  // 根据是否选择“只看缺少学分筛选”
  if (isLackCredit.value) {
    filteredData = filteredData.filter((student) => {
      // 检查学生的每个学分字段，是否有未达标的学分
      return Object.entries(student).some(([key, value]) => {
        // 筛选出学分字段（以 _credits 结尾），并判断值是否小于 0
        return key.endsWith('_credits') && typeof value === 'number' && value < 0;
      });
    });
  }

  // 更新筛选人数
  filteredCount.value = filteredData.length;
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

//5.将目前显示的表导出为excel
const IfExport=ref(false)
const exportToExcel=()=>{
    IfExport.value=false
    console.log("确认导出excel")
    if (filteredStudentData.value.length === 0) {
      alert('没有可导出的数据');
      return;
    }
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(filteredStudentData.value);
    XLSX.utils.book_append_sheet(workbook, worksheet, '筛选数据');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, '筛选数据.xlsx');
}


//6.显示echarts统计表
const centerDialogVisible = ref(false)
// 数据集

//计算各类学分未修满的学生数量
const creditCategories = [
  'spring_required_credits', 'limited_credits', 'core_credits',
  'autumn_required_credits', 
  'short_term_training_credits', 'outmajor_credits', 'numerical_logic_credits',
  'international_credits', 'innovation_credits', 'elective_credits',
  'culture_choose_credits', 'culture_core_credits', 'culture_total_credits'
];
//增加映射
const creditCategoryNames = {
  'spring_required_credits': '春季必修学分',
  'limited_credits': '专业限选学分',
  'core_credits': '专业核心学分',
  'autumn_required_credits': '秋季必修学分',
  'short_term_training_credits': '企业实训实践学分',
  'outmajor_credits': '跨专业学分',
  'numerical_logic_credits': '数字逻辑学分',
  'international_credits': '国际化学分',
  'innovation_credits': '创新学分',
  'elective_credits': '专业选修学分',
  'culture_choose_credits': '文化素质选修学分',
  'culture_core_credits': '文化素质核心学分',
  // 'culture_total_credits': '文化素质总学分'
};

// 计算未修满学分的学生数量，使用中文名称
const missingCreditData = computed(() => {
  const result = creditCategories.map(category => {
    const count = student_data.value.filter(student => {
      return student[category]< 0; // 如果学分 <= 0，表示未修满
    }).length;

    return {
      name: creditCategoryNames[category], // 使用中文名称
      value: count
    };
  });
  return result;
});


// 记录选中的学分类别和对应的学生列表
const selectedCategory = ref(null);
const studentsForCategory = ref([]);
const showMoocColumn = ref(false); // 默认不显示 MOOC 列

// 点击饼图时触发的事件
const handleChartClick = (params) => {
  const categoryNameInChinese = params.name; // 获取点击的中文类别名称
  console.log("categoryNameInChinese is ", categoryNameInChinese);

  // 根据中文名称查找对应的英文名称
  const categoryNameInEnglish = Object.keys(creditCategoryNames).find(
    key => creditCategoryNames[key] === categoryNameInChinese
  );

  if (categoryNameInEnglish) {
    selectedCategory.value = categoryNameInChinese;

    // 判断是否是“文化素质选修学分”或“文化素质核心学分”
    showMoocColumn.value =
      categoryNameInChinese === '文化素质选修学分' ||
      categoryNameInChinese === '文化素质核心学分';

    // 获取该类别下未修满学分的学生
    const students = student_data.value.filter(student => {
      return student[categoryNameInEnglish] < 0; // 根据英文名称进行筛选
    });

    // 存储未修满学分的学生数据
    studentsForCategory.value = students.map(student => ({
      name: student.student_name,
      id: student.student_id,
      credits: student[categoryNameInEnglish],
      major: student.major,
      mooc: student.MOOC
    }));
  }
};



//echarts配置
const option = computed(() => {
  return {
    title: {
      text: '学分未修满情况',
      left: 'center',
      textStyle: {
        fontSize:20,
        fontWeight:'bold',
      }
    },
    tooltip: {
      trigger: 'item',
      textStyle: {
        fontSize: 14,  // 设置提示框中的字体大小
        color:'black'  // 设置提示框中文本的颜色
      }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        fontSize: 15,  // 设置图例文字的字体大小
        color: '#333'  // 设置图例文字的颜色
      }
    },
    series: [
      {
        name: '未修满学分人数',
        type: 'pie',
        radius: '50%',
        data: missingCreditData.value.map(item => ({
          name: item.name,
          value: item.value
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        label: {
          // fontSize: 16,  // 设置每个饼图扇区标签的字体大小
          // color: '#fff',  // 设置扇区标签的字体颜色
          show: (params) => params.value > 0 // 只有当值大于0时才显示标签
        }
      },
    ],
  };
});

// 监听 dialog 是否打开或关闭
watch(centerDialogVisible, (newVal) => {
  if (!newVal) {
    // 关闭时清空数据
    studentsForCategory.value = [];
    searchQuery.value = ''; // 清空搜索框
    selectedCategory.value=null
    
  }
});

</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 10px;
  box-sizing: border-box;
}

.cardStyle {
  height: 100%;
  margin: 5px;
  padding: 10px 10px 10px 10px;
}
</style>
