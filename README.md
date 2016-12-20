# comboGrid For datatables
参考了:[datatimepicker.js](http://xdsoft.net/jqplugins/datetimepicker/)
使用方法：
```
/****主表单元格单击****/
    $('#jjg-table > tbody ').on('click','td',function (e) {
      var tr = $(this).closest('tr');
      var row = jjgtable.row( tr );
      var data = row.data();//当前行数据
      var colindex = $(e.target).index();
      var rowindex = row.index();
      var celldata=$(this).text();
      if (colindex==3){
        var put=$('<input type="text" style="width:100%;" value="'+celldata+'"/>');
        $(e.target).html(put);
        $("input[type=text]").comboGrid({
          maintableid:'#jjg-table',
          maintablecols:['wqgj','wqgjj','wqgdql','nqgjj','nqgdql','gqs','gqzj','jcj'],
          curtablecols:['wqgj','wqgjj','wqgdql','nqgjj','nqgdql','gqs','gqzj','jcj'],
          maintablerowindex:rowindex,
          tableid:'wqljh'+data.xh,
          url:'micros/core/dbop.php/?load=yxjcj*',
          serverSide:true,
          columns:[
            {"bSortable": false,"class":'center',"data":"xhgg","name":"xhgg","title":"型号规格"}
          ],
          aLengthMenu: [[-1], ["全部"]],
          scrollY: 208,//同时开启垂直(表格高度)和水平滚动条
          scrollX: "100%",
          sScrollXInner: "100%",
          scrollCollapse:true,
          dom:'t'
        }).focus();//输入框获得焦点

      }
      $(e.target).on('blur','input',function () {//输入框失去焦点时
        var txt=$(e.target).children("input").val();
        $(e.target).html(txt);
        jjgtable.cell($(e.target)).data(txt);//修改DataTables对象的数据

      });
      //return false;//停止函数执行-***重要，否则会
    });
```
