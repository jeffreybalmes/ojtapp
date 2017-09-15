<!DOCTYPE html>
<html lang="en">
<head>
    <title>Records & Reports</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link href='https://fonts.googleapis.com/css?family=Amatic+SC' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/id_layout.css">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

    <div class="container">
        <h3>OJT Database</h3>
        <div class="row">
            <hr>
        <!-- Search -->
                <div class="form-inline">
                    <input type="hidden" id="sort" value="ASC">
                    <input type="hidden" id="sortCol" value="id">
                    
                    &nbsp; 
                    <div class="btn-group">
                          <button type="button" name="btn_delete" id="btn_delete" class="btn btn-danger"><span class="glyphicon glyphicon-trash"></span></button>
                          <button type="button" name="create_excel" id="create_excel" class="btn btn-success"><span class="glyphicon glyphicon-export"></span></button>
                    </div>
                    &nbsp; &nbsp; &nbsp;
                    
                    <label for="limit">Show entries:</label>
                    <div class="form-group">
                        <select class="form-control" id="limit" onchange="searchUsers($('#searchInput').val(), $('#searchCol').val(), $('#sortCol').val(), $('#limit').val(), $('#sort').val())">
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    &nbsp; &nbsp; &nbsp;
                    
                    <label for="searchCol">Column:</label>
                    <div class="form-group">
                        <select class="form-control" id="searchCol" onclick="searchUsers($('#searchInput').val(), $('#searchCol').val(), $('#sortCol').val(), $('#limit').val(), $('#sort').val())">
                          <option value="all">All</option>
                          <option value="id">id</option>
                          <option value="control">control</option>
                          <option value="nickname">nickname</option>
                          <option value="name">name</option>
                          <option value="address">address</option>
                          <option value="school">school</option>
                          <option value="gender">gender</option>
                          <option value="birthday">birthday</option>
                          <option value="contact">contact</option>
                          <option value="guardian">guardian</option>
                          <option value="econtact">econtact</option>
                          <option value="department">department</option>
                          <option value="supervisor">supervisor</option>
                          <option value="designation">designation</option>
                          <option value="slapd">slapd</option>
                          <option value="apdtitle">apdtitle</option>
                          <option value="hours">hours</option>
                          <option value="validity">validity</option>
                          <option value="interview">interview</option>
                          <option value="started">started</option>
                          <option value="end">end</option>
                        </select>
                    </div>

                    <div class="input-group pull-right">
                        <div class="form-group">
                            <input placeholder="search" type="text" class="search form-control" id="searchInput" onchange="searchUsers($('#searchInput').val(), $('#searchCol').val(), $('#sortCol').val(), $('#limit').val(), $('#sort').val())">
                        </div>
                        <span class="input-group-btn">
                            <button class="btn btn-primary" onclick="searchUsers($('#searchInput').val(), $('#searchCol').val(), $('#sortCol').val(), $('#limit').val(), $('#sort').val())"><i class="glyphicon glyphicon-search"></i></button>
                        </span>
                    </div>
                </div>    
        <!-- EndSearch -->
            <br>
            <div class="panel panel-default users-content">
                <div class="panel-heading">Users 
                    <a href="javascript:void(0);" class="glyphicon glyphicon-plus pull-right" id="addLink" onclick="javascript:$('#addForm').slideToggle(); $('#editForm').slideUp(); $('#tbl_setting').slideUp();"></a> 
                </div>

                <?php include 'addForm.php';?>
                <?php include 'editForm.php';?>
                
                <div id="displayData" style="overflow-x: auto; height: auto; max-height: 592px"></div>
            </div>
            <div id="pages"></div> 
            <hr>

            <div class="btn-group">
                <button type="button" class="btn btn-danger" onclick="$('#card').empty()"><span class="glyphicon glyphicon-remove-sign"></span></button>
                <button type="button" name="btn_card" id="btn_card" class="btn btn-info"><span class="glyphicon glyphicon-pencil"></span></button>
                <button type="button" class="btn btn-primary" onclick="printPageArea('card')"><span class="glyphicon glyphicon-print"></span></button>
            </div>
            <br><br>
            <center><div id="card" style="overflow-x: auto; height: auto; max-height: 420px; width: 1055px;"></div></center>

        </div>

        <hr>
        <div class="row">
            <div class="col-lg-12">
                <ul class="nav nav-pills nav-justified">
                    <li><a href="#"><span>© 2016 JEFFREY B. BALMES</span></a></li>
                </ul>
            </div>
        </div>
    </div>


    <script src="assets/js/jquery-3.1.1.min.js"></script>
    <script src="assets/js/bootstrap.min.js"></script>
    <script src="assets/js/script.js"></script>

</body>
</html>