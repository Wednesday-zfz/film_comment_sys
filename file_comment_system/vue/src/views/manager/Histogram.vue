<template>
  <div>
    <div class="charts-container">
      <div class="top">
        <!-- 总评分前十 -->
        <div id="top-scores" class="chart-top"></div>
        <!-- 点赞量前十 -->
        <div id="top-likes" class="chart-top"></div>
      </div>

      <!-- 中间：饼图和四张小图 -->
      <div class="bottom">
        <div class="small-chart-container">
          <div id="small-chart1" class="small-chart"></div>
          <div id="small-chart3" class="small-chart"></div>
        </div>

        <div id="type-statistics" class="chart-middle"></div>

        <div class="small-chart-container">
          <div id="small-chart2" class="small-chart"></div>
          <div id="small-chart4" class="small-chart"></div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import * as echarts from 'echarts';
import request from '@/utils/request';

export default {
  data() {
    return {
      statistics: null,
    };
  },
  methods: {
    async fetchStatistics() {
      try {
        const res = await request.get('/statistics/');
        this.statistics = res.data;
        this.renderCharts();
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      }
    },


    renderCharts() {

      // 1. 总评分前十
      const topScores = this.statistics.total_scores.slice(0, 10);
      const topScoresChart = echarts.init(document.getElementById('top-scores'));
      topScoresChart.setOption({
        title: {
          text: '总评分前十',
          left: "center",
          textStyle: {
            fontSize: 20,
            fontWeight: "bolder",
            color: "#1E447F"
          },
          top: "5%"
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          top: "30%",
          bottom: "25%", // 减少底部留白，压缩Y轴的高度
          left: "15%", // 控制左边距
          right: "15%" // 控制右边距
        },
        color: ["#1E447F"],
        calculable: true,
        xAxis: {
          type: 'category',
          data: topScores.map(item => item.name),
          axisLabel: {
            fontSize: 9,
            rotate: 45, // 标签旋转角度，45 度为倾斜效果
            formatter: value => value.length > 5 ? value.slice(0, 5) + '...' : value // 长文本截断
          },
        },
        yAxis: {
          max: 5,
          type: 'value',
          axisLabel: {
            fontSize: 14,
          },
          axisLine: {
            show: true
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: "#333"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#D3D3D3"
            }
          }
        },
        series: [
          {
            name: '总评分',
            type: 'bar',
            data: topScores.map(item => item.total_score),
            itemStyle: {
              normal: {
                borderRadius: [8, 8, 8, 8]
              }
            },
            label: {
              show: true,
              position: "top",
              fontSize: 14,
              color: "#1E447F",
            }
          },
        ],
        graphic: [
          {
            type: "line",
            left: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          {
            type: "line",
            left: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 0,
              x2: 30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          // 右上角尖角
          {
            type: "line",
            right: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          {
            type: "line",
            right: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 0,
              x2: 30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          // 左下角尖角
          {
            type: "line",
            left: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: -30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          {
            type: "line",
            left: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: 0,
              x2: -30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          // 右下角尖角
          {
            type: "line",
            right: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: -30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          {
            type: "line",
            right: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: 0,
              x2: -30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          }
        ]
      });

      // 2. 点赞量前十
      const topLikes = this.statistics.like_counts.slice(0, 10);
      const topLikesChart = echarts.init(document.getElementById('top-likes'));
      topLikesChart.setOption({
        title: {
          text: '收藏量前十',
          left: "center",
          textStyle: {
            fontSize: 20,
            fontWeight: "bolder",
            color: "#FBA639"
          },
          top: "5%"
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          top: "30%",
          bottom: "25%", // 减少底部留白，压缩Y轴的高度
          left: "15%", // 控制左边距
          right: "15%" // 控制右边距
        },
        calculable: true,
        color: ["#FBA639"],
        xAxis: {
          type: 'category',
          data: topLikes.map(item => item.name),
          axisLabel: {
            fontSize: 9,
            rotate: 45, // 标签旋转角度，45 度为倾斜效果
            formatter: value => value.length > 5 ? value.slice(0, 5) + '...' : value // 长文本截断
          }
        },
        yAxis: {
          type: 'value',
          min: 0,
          axisLabel: {
            fontSize: 14,
          },
          axisLine: {
            show: true
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: "#333"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#D3D3D3"
            }
          }
        },
        series: [
          {
            name: '收藏量',
            type: 'bar',
            data: topLikes.map(item => item.like_count),
            itemStyle: {
              normal: {
                borderRadius: [8, 8, 8, 8]
              }
            },
            label: {
              show: true,
              position: "top",
              fontSize: 14,
              color: "#FBA639",
            }
          },
        ],
        graphic: [
          {
            type: "line",
            left: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          {
            type: "line",
            left: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 0,
              x2: 30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          // 右上角尖角
          {
            type: "line",
            right: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          {
            type: "line",
            right: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 0,
              x2: 30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          // 左下角尖角
          {
            type: "line",
            left: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: -30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          {
            type: "line",
            left: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: 0,
              x2: -30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          // 右下角尖角
          {
            type: "line",
            right: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: -30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          {
            type: "line",
            right: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: 0,
              x2: -30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          }
        ]
      });

      // 3. 类型统计（展示每种类型的数量）
      const typeStats = this.statistics.type_statistics;
      const maxType = typeStats.reduce((prev, current) => prev.entity_count > current.entity_count ? prev : current);
      const typeStatisticsChart = echarts.init(document.getElementById('type-statistics'));
      typeStatisticsChart.setOption({
        title: {
          text: '类型数量统计',
          left: 'center',
          top: '5%',
          textStyle: {
            fontSize: 24,
            fontWeight: 'bolder',
            color: '#1E447F', // 确保标题颜色和背景形成对比
          },
        },
        grid: {
          top: '15%', // 确保留出足够空间展示标题
          bottom: '5%', // 确保图例和轴标签有足够空间
          left: '5%',
          right: '5%',
        },
        tooltip: {
          trigger: 'item', // 确保显示悬停提示信息
          formatter: '{b}: {c}个 ({d}%)', // 显示名称、值和百分比
        },
        series: [
          {
            name: '类型数量',
            type: 'pie',
            radius: ["35%", "55%"],
            label: {
              fontSize: 10,
              color: '#1E447F',
            },
            color: [
              "#1E5094",
              "#5076AB",
              "#8CA5C7",
              "#6B8CB8",
              "#6083B3",
              "#6276A5",
              "#8CA5C8",
              "#C3D0E2"
            ],
            data: typeStats.map(item => ({
              value: item.entity_count,
              name: item.name,
            })),
          },
        ],
        graphic: [
          {
            type: 'text',
            left: 'center',
            top: '45%', // 确保文字在饼图中心
            style: {
              text: `最大数量类型:\n${maxType.name}`,
              textAlign: 'center',
              fontSize: 14,
              fontWeight: 'bolder',
              lineHeight: 20,
              fill: '#FBA639', // 确保文字颜色和背景形成对比
            },
          },
          // 左上
          {
            type: "line",
            left: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 2
            }
          },
          {
            type: "line",
            left: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 0,
              x2: 30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 2
            }
          },
          // 右上
          {
            type: "line",
            right: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 2
            }
          },
          {
            type: "line",
            right: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 0,
              x2: 30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 2
            }
          },
          // 左下
          {
            type: "line",
            left: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: -30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 2
            }
          },
          {
            type: "line",
            left: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: 0,
              x2: -30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 2
            }
          },
          // 右下
          {
            type: "line",
            right: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: -30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 2
            }
          },
          {
            type: "line",
            right: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: 0,
              x2: -30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 2
            }
          }
        ]

      });

      // 4. 小图表1：评分细则对比
      const scoreDetails = this.statistics.score_details;
      const smallChart1 = echarts.init(document.getElementById('small-chart1'));
      smallChart1.setOption({
        title: {
          text: '评分前五细则对比',
          left: 'center',
          textStyle: {
            fontSize: 16,
            color: '#1E447F',
            fontWeight: "bolder",
          },
          top: '5%',
        },
        tooltip: {
          trigger: 'item', // 鼠标悬停时触发提示框
          formatter: function (params) {
            const {name, value} = params;
            return `${name}<br>数理能力: ${value[0]}<br>语言能力: ${value[1]}<br>图片能力: ${value[2]}<br>文本能力: ${value[3]}`;
          }
        },
        grid: {
          top: "30%",
          bottom: "25%", // 减少底部留白，压缩Y轴的高度
          left: "15%", // 控制左边距
          right: "15%" // 控制右边距
        },
        calculable: true,
        radar: {
          radius: "50%", // 调整雷达图的大小，留出一定边距
          center: ["50%", "55%"], // 调整雷达图的中心位置，使其更居中
          indicator: [
            {name: '数理能力', max: 5},
            {name: '语言能力', max: 5},
            {name: '图片能力', max: 5},
            {name: '文本能力', max: 5},
          ],
        },
        series: [
          {
            name: '评分细则',
            type: 'radar',
            data: scoreDetails.map(item => ({
              value: [item.total_score1_rounded, item.total_score2_rounded, item.total_score3_rounded, item.total_score4_rounded],
              name: item.name,
            })),
          },
        ],
        graphic: [
          {
            type: "line",
            left: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          {
            type: "line",
            left: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 0,
              x2: 30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          // 右上角尖角
          {
            type: "line",
            right: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          {
            type: "line",
            right: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 0,
              x2: 30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          // 左下角尖角
          {
            type: "line",
            left: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: -30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          {
            type: "line",
            left: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: 0,
              x2: -30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          // 右下角尖角
          {
            type: "line",
            right: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: -30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          {
            type: "line",
            right: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: 0,
              x2: -30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          }
        ]
      });


      // 5. 小图表2：评分细则对比
      const likeDetails = this.statistics.like_details;
      const smallChart2 = echarts.init(document.getElementById('small-chart2'));
      smallChart2.setOption({
        title: {
          text: '收藏前五细则对比',
          left: 'center',
          textStyle: {
            fontSize: 16,
            color: '#FBA639',
            fontWeight: "bolder",
          },
          top: '5%',
        },
        tooltip: {
          trigger: 'item', // 鼠标悬停时触发提示框
          formatter: function (params) {
            const {name, value} = params;
            return `${name}<br>数理能力: ${value[0]}<br>语言能力: ${value[1]}<br>图片能力: ${value[2]}<br>文本能力: ${value[3]}`;
          }
        },
        grid: {
          top: "30%",
          bottom: "25%", // 减少底部留白，压缩Y轴的高度
          left: "15%", // 控制左边距
          right: "15%" // 控制右边距
        },
        calculable: true,
        radar: {
          radius: "50%", // 调整雷达图的大小，留出一定边距
          center: ["50%", "55%"], // 调整雷达图的中心位置，使其更居中
          indicator: [
            {name: '数理能力', max: 5},
            {name: '语言能力', max: 5},
            {name: '图片能力', max: 5},
            {name: '文本能力', max: 5},
          ],
        },
        series: [
          {
            name: '评分细则',
            type: 'radar',
            data: likeDetails.map(item => ({
              value: [item.total_score1_rounded, item.total_score2_rounded, item.total_score3_rounded, item.total_score4_rounded],
              name: item.name,
            })),
          },
        ],
        graphic: [
          {
            type: "line",
            left: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          {
            type: "line",
            left: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 0,
              x2: 30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          // 右上角尖角
          {
            type: "line",
            right: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          {
            type: "line",
            right: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 0,
              x2: 30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          // 左下角尖角
          {
            type: "line",
            left: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: -30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          {
            type: "line",
            left: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: 0,
              x2: -30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          // 右下角尖角
          {
            type: "line",
            right: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: -30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          {
            type: "line",
            right: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: 0,
              x2: -30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          }
        ]
      });


      // 6. 小图表3：第一组柱状图数据（数理能力 & 语言能力）
      const firstGroupMathScoresNames = this.statistics.top_scores.math_ability.map((item) => item.name);
      const firstGroupMathScores = this.statistics.top_scores.math_ability.map(
          (item) => item.total_score1
      );
      const firstGroupLanguageNames = this.statistics.top_scores.language_ability.map((item) => item.name);
      const firstGroupLanguageScores = this.statistics.top_scores.language_ability.map(
          (item) => item.total_score2
      );
      const smallChart3 = echarts.init(document.getElementById("small-chart3"));
      smallChart3.setOption({
        title: {
          text: "细则前三名",
          subtitle: "数理能力 & 语言能力",
          left: "center",
          textStyle: {
            fontSize: 16,
            color: "#1E447F",
          },
          top: "5%",
        },
        tooltip: {
          trigger: 'axis', // 使用 'axis' 以支持多系列提示
          formatter: function (params) {
            let tooltipContent = '';
            params.forEach((item) => {
              const dataIndex = item.dataIndex;
              const seriesName = item.seriesName;
              let specificName = '';
              if (seriesName === '数理能力') {
                specificName = firstGroupMathScoresNames[dataIndex];
              } else if (seriesName === '语言能力') {
                specificName = firstGroupLanguageNames[dataIndex];
              }
              tooltipContent += `${seriesName}: ${specificName}<br>分数: ${item.value}<br>`;
            });
            return tooltipContent;
          },
        },
        legend: {
          data: ["数理能力", "语言能力"],
          top: "20%",
        },
        grid: {
          left: "10%",
          right: "10%",
          top: "40%",
          bottom: "20%",
        },
        xAxis: {
          type: "category",
          data: ["第一名", "第二名", "第三名"],
        },
        yAxis: {
          type: "value",
          min: 0,
          max: 5,
        },
        series: [
          {
            name: "数理能力",
            type: "bar",
            data: firstGroupMathScores,
            barWidth: "30%",
            itemStyle: {color: "#1E5094"},
          },
          {
            name: "语言能力",
            type: "bar",
            data: firstGroupLanguageScores,
            barWidth: "30%",
            itemStyle: {color: "#FBA639"},
          },
        ],
        graphic: [
          {
            type: "line",
            left: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          {
            type: "line",
            left: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 0,
              x2: 30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          // 右上角尖角
          {
            type: "line",
            right: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          {
            type: "line",
            right: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 0,
              x2: 30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          // 左下角尖角
          {
            type: "line",
            left: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: -30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          {
            type: "line",
            left: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: 0,
              x2: -30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          // 右下角尖角
          {
            type: "line",
            right: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: -30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          {
            type: "line",
            right: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: 0,
              x2: -30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          }
        ]
      });

      // 7. 小图表4：第二组柱状图数据（图片能力 & 文本能力）
      const firstGroupImageNames = this.statistics.top_scores.image_ability.map((item) => item.name);
      const firstGroupImageScores = this.statistics.top_scores.image_ability.map(
          (item) => item.total_score3
      );
      const firstGroupTextNames = this.statistics.top_scores.text_ability.map((item) => item.name);
      const firstGroupTextScores = this.statistics.top_scores.text_ability.map(
          (item) => item.total_score4
      );
      const smallChart4 = echarts.init(document.getElementById("small-chart4"));
      smallChart4.setOption({
        title: {
          text: "细则前三名",
          subtitle: "图片能力 & 文本能力",
          left: "center",
          textStyle: {
            fontSize: 16,
            color: "#FBA639",
          },
          top: "5%",
        },
        tooltip: {
          trigger: 'axis', // 使用 'axis' 以支持多系列提示
          formatter: function (params) {
            let tooltipContent = '';
            params.forEach((item) => {
              const dataIndex = item.dataIndex;
              const seriesName = item.seriesName;
              let specificName = '';
              if (seriesName === '图片能力') {
                specificName = firstGroupImageNames[dataIndex];
              } else if (seriesName === '文本能力') {
                specificName = firstGroupTextNames[dataIndex];
              }
              tooltipContent += `${seriesName}: ${specificName}<br>分数: ${item.value}<br>`;
            });
            return tooltipContent;
          },
        },
        legend: {
          data: ["图片能力", "文本能力"],
          top: "20%",
        },
        grid: {
          left: "10%",
          right: "10%",
          top: "40%",
          bottom: "20%",
        },
        xAxis: {
          type: "category",
          data: ["第一名", "第二名", "第三名"],
        },
        yAxis: {
          type: "value",
          min: 0,
          max: 5,
        },
        series: [
          {
            name: "图片能力",
            type: "bar",
            data: firstGroupImageScores,
            barWidth: "30%",
            itemStyle: {color: "#1E5094"},
          },
          {
            name: "文本能力",
            type: "bar",
            data: firstGroupTextScores,
            barWidth: "30%",
            itemStyle: {color: "#FBA639"},
          },
        ],
        graphic: [
          {
            type: "line",
            left: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          {
            type: "line",
            left: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 0,
              x2: 30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          // 右上角尖角
          {
            type: "line",
            right: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          {
            type: "line",
            right: "0%",
            top: "0%",
            shape: {
              x1: 0,
              y1: 0,
              x2: 30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          // 左下角尖角
          {
            type: "line",
            left: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: -30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          {
            type: "line",
            left: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: 0,
              x2: -30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          // 右下角尖角
          {
            type: "line",
            right: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: -30,
              x2: 0,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          },
          {
            type: "line",
            right: "0%",
            bottom: "2%",
            shape: {
              x1: 0,
              y1: 0,
              x2: -30,
              y2: 0
            },
            style: {
              stroke: "#1E447F",
              lineWidth: 3
            }
          }
        ]
      });


    },
  },
  mounted() {
    this.fetchStatistics();
  },
};
</script>

<style>
.charts-container {
  width: 100%;
  height: 100%;
  margin: 20px auto;
}

.top {
  height: 30%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
}

.chart-top {
  width: 48%; /* 两个图表并排 */
  height: 220px;
}

.bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70%;
  margin-top: 40px;
}

.chart-middle {
  width: 35%; /* 饼图占较大空间 */
  height: 350px;
  margin: 0 20px;
}

.small-chart-container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 500px;
}

.small-chart {
  width: 270px; /* 小图表的宽度 */
  height: 230px; /* 小图表的高度 */
  margin: 0 20px;
}

</style>
