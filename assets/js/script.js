function addFilePreview(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#userForm + img').remove();
            $('#addThumbnail').html('<img id="imageAdd" src="'+e.target.result+'" width="450" height="300"/>');
        }
        reader.readAsDataURL(input.files[0]);
    }

}

function editFilePreview(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#userForm + img').remove();
            $('#editThumbnail').html('<img id="imageEdit" src="'+e.target.result+'" width="450" height="300"/>');
        }
        reader.readAsDataURL(input.files[0]);
    }

}


function searchUsers(val,searchCol,sortCol,limit, order){
    if (order == 'ASC') {
       order = 'DESC';
       arrow = '&nbsp;<span class="glyphicon glyphicon-sort-by-attributes-alt"></span>';
    } else {
       order = 'ASC';
       arrow = '&nbsp;<span class="glyphicon glyphicon-sort-by-attributes"></span>';
    }

    var sendData = 'val='+val+'&searchCol='+searchCol+'&sortCol='+sortCol+'&limit='+limit+'&totalitems=1&adjacents=2'+'&order='+order;

    $.ajax({
        type: 'POST',
        url: 'getData.php',
        data: sendData,
        success:function(html){
            $('#displayData').html(html);
            $('#'+sortCol+'').append(arrow);
        }
    });

    $.ajax({
        type: 'POST',
        url: 'getPage.php',
        data: sendData,
        success:function(html){
            $('#pages').html(html);
        }
    });
}

function getUsers(){
    $.ajax({
        type: 'POST',
        url: 'userAction.php',
        data: 'action_type=view&'+$("#userForm").serialize(),
        success:function(html){
            $('#displayData').html(html);
        }
    });
}

function printPageArea(areaID){
    var restorepage = document.body.innerHTML;
    var printcontent = document.getElementById(areaID).innerHTML;
    $('link[href="assets/css/bootstrap.min.css"]').attr('href', '#');
    document.body.innerHTML = printcontent;
    window.print();
    $('link[href="#"]').attr('href', 'assets/css/bootstrap.min.css');
    document.body.innerHTML = restorepage;
}

$(document).ready(function() {

    //Disable mouse right click
    $("body").on("contextmenu",function(e){
        return false;
    });


    $("input:checkbox:not(:checked)").each(function() {
        var column = "table ." + $(this).attr("name");
        $(column).hide();
    });

    $("input:checkbox").click(function(){
        var column = "table ." + $(this).attr("name");
        $(column).toggle();
    });


     $('#select_all').on('click',function(){
        if(this.checked){
            $('.check_box').each(function(){
                this.checked = true;
                var column = "table ." + $(this).attr("name");
                $(column).toggle();
            });
        }else{
             $('.check_box').each(function(){
                this.checked = false;
                var column = "table ." + $(this).attr("name");
                $(column).hide();
            });
        }
    });
    
    $('.check_box').on('click',function(){
        if($('.check_box:checked').length == $('.check_box').length){
            $('#select_all').prop('checked',true);
        }else{
            $('#select_all').prop('checked',false);
        }
    });

    

    $(document).on('click','.table-row', function (event) {
        $(this).toggleClass('highlight_row');
    });

    $("#create_excel").click(function(e) {
       e.preventDefault();

       //getting data from our table
       var data_type = 'data:application/vnd.ms-excel';
       var table_div = document.getElementById('displayData');
       var table_html = table_div.outerHTML.replace(/ /g, '%20');

       var a = document.createElement('a');
       a.href = data_type + ', ' + table_html;
       a.download = 'exported_table_' + Math.floor((Math.random() * 9999999) + 1000000) + '.xls';
       a.click();
     });

    $('#btn_delete').click(function() {
        if (confirm('Are you sure you want to delete this?')) {
            var id = [];
            $('td :checkbox:checked').each(function(i) {
                id[i] = $(this).val();
            });
            if (id.length === 0) {
                alert('Please select atleast one checkbox');
            }else{
                $.ajax({
                    url: 'delete.php',
                    method: 'POST',
                    data: {id:id},
                    success:function(){
                        for (var i = 0; i < id.length; i++) {
                            $('tr#'+id[i]+'').css('background-color', '#ccc');
                            $('tr#'+id[i]+'').fadeOut('slow');
                        }
                    }
                });
            }
        } else {
            return false;
        }
    });

    $('#btn_card').click(function() {
        var id = [];
        $('td :checkbox:checked').each(function(i) {
            id[i] = $(this).val();
        });
        if (id.length === 0) {
            alert('Please select atleast one checkbox');
        }else{
            $.ajax({
                url: 'card.php',
                method: 'POST',
                data: {id:id},
                success:function(html){
                    for (var i = 0; i < id.length; i++) {
                        $('tr#'+id[i]+'').css('background-color', '#ccc');
                        $('tr#'+id[i]+'').fadeOut('slow').fadeIn('slow');
                        $('tr#'+id[i]+'').css('background-color', '#fff');
                    }
                    $('#card').append(html);
                }
            });
        }
    });

    $('#displayData').load('getData.php');
    $('#pages').load('getPage.php');

    $('#pages').on('click', 'a', function(event) {
        event.preventDefault();
        var page = $(this).attr('data-page');
        var searchInput = $('#searchInput').val(); 
        var searchCol = $('#searchCol').val(); 
        var sortCol = $('#sortCol').val();
        var limit = $('#limit').val();
        var order = $('#sort').val();

        if (order == 'ASC') {
           order = 'DESC';
           arrow = '&nbsp;<span class="glyphicon glyphicon-sort-by-attributes-alt"></span>';
        } else {
           order = 'ASC';
           arrow = '&nbsp;<span class="glyphicon glyphicon-sort-by-attributes"></span>';
        }

        var sendData = 'page='+page+'&totalitems=1&limit='+limit+'&adjacents=2&searchCol='+searchCol+'&sortCol='+sortCol+'&val='+searchInput+'&order='+order;

        $.ajax({
           type: 'POST',
           url: 'getData.php',
           data: sendData,
           success: function(data){
                $('#displayData').html(data);
                $('#'+sortCol+'').append(arrow);
           }
        });

        $.ajax({
           type: 'POST',
           url: 'getPage.php',
           data: sendData,
           success: function(data){
                $('#pages').html(data);
           }
        });
    });


  $('#displayData').on('click', '.column_sort', function(event){  
       event.preventDefault(); 
       var searchInput = $('#searchInput').val(); 
       var searchCol = $('#searchCol').val(); 
       var limit = $('#limit').val();
       var sortCol = $(this).attr('id');  
       var order = $('#sort').val();  
       var arrow = '';  

       if(order == 'ASC'){
            arrow = '&nbsp;<span class="glyphicon glyphicon-sort-by-attributes"></span>';
       }else{
            arrow = '&nbsp;<span class="glyphicon glyphicon-sort-by-attributes-alt"></span>';
       }  

       var sendData = 'page=1&searchCol='+searchCol+'&sortCol='+sortCol+'&val='+searchInput+'&order='+order+'&limit='+limit;

       $.ajax({  
            url: 'getData.php',  
            method: 'POST',  
            data: sendData,  
            success:function(data){
                 $('#displayData').html(data);  
                 $('#'+sortCol+'').append(arrow);  
                 if (order == 'DESC') {
                    $('#sort').val('ASC');
                 } else {
                    $('#sort').val('DESC');
                 }
                 $('#sortCol').val(sortCol);

                 $.ajax({
                    type: 'POST',
                    url: 'getPage.php',
                    data: sendData,
                    success: function(data){
                         $('#pages').html(data);
                    }
                 });
            }  
       })  
  });  



    $('#addForm').children('form').on('submit', function(e) {
        e.preventDefault();

        var extension = $('#addFile').val().split('.').pop().toLowerCase();  
        if(extension != ''){ 
             if($.inArray(extension, ['gif','png','jpg','jpeg']) == -1){ 
                  alert("Invalid Image File");  
                  $('#addFile').val('');  
                  return false;  
             }  
        } 


        var addData = new FormData($(this)[0]);
        addData.append('action_type', 'add');

        $.ajax({
            type: 'POST',
            url: 'userAction.php',
            data: addData,
            processData: false,
            contentType: false,
            success:function(msg){
                if(msg == 'ok'){
                    alert('User data has been added successfully.');
                    searchUsers($('#searchInput').val(), $('#searchCol').val(), $('#sortCol').val(), $('#limit').val(), $('#sort').val());
                    $('.form')[0].reset();
                    $('.formData').slideUp();
                    $('#tbl_setting').slideUp();
                    $('#addForm').find('img').attr('src', 'blank.jpg');
                }else{
                    alert('Some problem occurred, please try again.');
                }
            }
        });

    });


    $('#editForm').children('form').on('submit', function(e) {
        e.preventDefault();

        var extension = $('#editFile').val().split('.').pop().toLowerCase();  
        if(extension != ''){ 
             if($.inArray(extension, ['gif','png','jpg','jpeg']) == -1){ 
                  alert("Invalid Image File");  
                  $('#editFile').val('');  
                  return false;  
             }  
        }

        var editData = new FormData($(this)[0]);
        editData.append('action_type', 'edit');

        $.ajax({
            type: 'POST',
            url: 'userAction.php',
            data: editData,
            processData: false,
            contentType: false,
            success:function(msg){
                if(msg == 'ok'){
                    alert('User data has been updated successfully.');
                    searchUsers($('#searchInput').val(), $('#searchCol').val(), $('#sortCol').val(), $('#limit').val(), $('#sort').val());
                    $('.form')[1].reset();
                    $('.formData').slideUp();
                    $('#tbl_setting').slideUp();
                    $('#editForm').find('img').attr('src', 'blank.jpg');
                }else{
                    alert('Some problem occurred, please try again.');
                }
            }
        });
    });
});


    
function userAction(type, id){
   id = (typeof id == "undefined")?'':id;
   var statusArr = {add:"added",edit:"updated",delete:"deleted"};
   var userData = '';
   if (type == 'add') {
       userData = $("#addForm").find('.form').serialize()+'&action_type='+type+'&id='+id;
   }else if (type == 'edit'){
       userData = $("#editForm").find('.form').serialize()+'&action_type='+type;
   }else{
       userData = 'action_type='+type+'&id='+id;
   }
   $.ajax({
       type: 'POST',
       url: 'userAction.php',
       data: userData,
        success:function(msg){
            if(msg == 'ok'){
                alert('User data has been '+statusArr[type]+' successfully.');
                searchUsers($('#searchInput').val(), $('#searchCol').val(), $('#sortCol').val(), $('#limit').val(), $('#sort').val());
                $('.form')[0].reset();
                $('.formData').slideUp();
                $('#tbl_setting').slideUp();
            }else{
                alert('Some problem occurred, please try again.');
            }
        }
    });
}


function editUser(id){
    $('#addForm').slideUp();
    $('#tbl_setting').slideUp();
    $.ajax({
        type: 'POST',
        dataType:'JSON',
        url: 'userAction.php',
        data: 'action_type=data&id='+id,
        success:function(data){
            $('#idEdit').val(data.id);
            $('#idEditText').val(data.id);
            $('#controlEdit').val(data.control);
            $('#nicknameEdit').val(data.nickname);
            $('#nameEdit').val(data.name);
            $('#addressEdit').val(data.address);
            $('#schoolEdit').val(data.school);
            $('#genderEdit').val(data.gender);
            $('#birthdayEdit').val(data.birthday);
            $('#contactEdit').val(data.contact);
            $('#guardianEdit').val(data.guardian);
            $('#econtactEdit').val(data.econtact);
            $('#facilityEdit').val(data.facility);
            $('#departmentEdit').val(data.department);
            $('#supervisorEdit').val(data.supervisor);
            $('#designationEdit').val(data.designation);
            $('#slapdEdit').val(data.slapd);
            $('#apdtitleEdit').val(data.apdtitle);
            $('#hoursEdit').val(data.hours);
            $('#validityEdit').val(data.validity);
            $('#interviewEdit').val(data.interview);
            $('#startedEdit').val(data.started);
            $('#endEdit').val(data.end);

            if(data.filelocation == 'image/'){
              $('#imageEdit').attr('src', 'blank.jpg');
            }else{
              $('#imageEdit').attr('src', data.filelocation);
            }

            $('#editForm').slideDown();
        }
    });
}

function openform() {
    window.open("http://localhost/acore/modify", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
}