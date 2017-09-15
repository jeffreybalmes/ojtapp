<?php

class DB{
	private $dbHost     = "localhost";
	private $dbUsername = "root";
	private $dbPassword = "";
	private $dbName     = "batscty";
	
	public function __construct(){

		if (!isset($this->db)) {
			try {
				$conn = new PDO("mysql:host=".$this->dbHost.";dbname=".$this->dbName, $this->dbUsername, $this->dbPassword);
				$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$this->db = $conn;
			} catch (PDOException $e) {
				die("Failed to connect with MySQL: ". $e->getMessage());
			}
		}
	}
	
	public function getRows($table,$condition = array()){
		$sql = 'SELECT ';
		$sql .= array_key_exists("select",$condition)?$condition['select']:'*';
		$sql .= ' FROM '.$table;

		if (!array_key_exists("like", $condition) && array_key_exists("where", $condition)) {
			$sql .= ' WHERE ';
			$i = 0;

			foreach ($condition['where'] as $key => $value) {
				$pre = ($i > 0)?' AND ':'';
				$sql .= $pre.$key."='".$value."'";
				$i++;
			}
		}

		// for search
		if (!array_key_exists("where", $condition) && array_key_exists("like", $condition) && !empty($condition['like'])) {

			$sql .= ' WHERE ';
			$whereClauses = array();
			$keyword_tokens = explode(' ', $condition['like']['keywords']);

			if (is_array($condition['like']['concat'])) {
				$concats[] = implode(', ', $condition['like']['concat']);

				for ($i=0; $i < count($concats); $i++) { 
					foreach ($keyword_tokens as $keyword) {
					    $keyword = mysql_real_escape_string($keyword);
					    $whereClauses[] = "CONCAT(" .$concats[$i]. ") LIKE '%$keyword%'";
					}
				}
			} else {
				$concats = $condition['like']['concat'];

				for ($i=0; $i < count($concats); $i++) { 
					foreach ($keyword_tokens as $keyword) {
					    $keyword = mysql_real_escape_string($keyword);
					    $whereClauses[] = $concats . " LIKE '%$keyword%'";
					}
				}
			}

			$sql .= implode(' OR ', $whereClauses);
		}
		// end search
		
		if(array_key_exists("order_by",$condition)){
			$sql .= ' ORDER BY '.$condition['order_by']; 
		}
		
		if(array_key_exists("start",$condition) && array_key_exists("limit",$condition)){
			$sql .= ' LIMIT '.$condition['start'].','.$condition['limit']; 
		}elseif(!array_key_exists("start",$condition) && array_key_exists("limit",$condition)){
			$sql .= ' LIMIT '.$condition['limit']; 
		}
		
		$query = $this->db->prepare($sql);
		$query->execute();
		

		if (array_key_exists("return_type", $condition) && $condition['return_type'] != 'all') {
			switch ($condition['return_type']) {
				case 'count':
					$data = $query->rowCount();
					break;
				case 'single':
					$data = $query->fetch(PDO::FETCH_ASSOC);
					break;
				
				default:
					$data = '';
					break;
			}
		} else {
			if ($query->rowCount() > 0) {
				$data = $query->fetchAll();
			}
		}
		return !empty($data)?$data:false; 
	}
	
	public function insert($table,$data){
		if(!empty($data) && is_array($data)){
			$columnString = '';
			$valueString  = '';
			$i = 0;

			if(!array_key_exists('created',$data)){
				$data['created'] = date("Y-m-d H:i:s");
			}
			if(!array_key_exists('modified',$data)){
				$data['modified'] = date("Y-m-d H:i:s");
			}

			$columnString = implode(',', array_keys($data));
			$valueString = ":".implode(',:', array_keys($data));

			$sql = "INSERT INTO ".$table." (".$columnString.") VALUES (".$valueString.")";


			$query = $this->db->prepare($sql);

			foreach ($data as $key => $value) {
				$query->bindValue(":".$key, $value);
			}

			$insert = $query->execute();
			return $insert?$this->db->lastInsertId():false;

		}else{
			return false;
		}
	}
	
	public function update($table,$data,$condition){
		if(!empty($data) && is_array($data)){
			$colvalSet = '';
			$whereSql = '';
			$i = 0;
			
			if(!array_key_exists('modified',$data)){
				$data['modified'] = date("Y-m-d H:i:s");
			}

			foreach($data as $key=>$val){
				$pre = ($i > 0)?', ':'';
				$colvalSet .= $pre.$key."='".$val."'";
				$i++;
			}
			if(!empty($condition)&& is_array($condition)){
				$whereSql .= ' WHERE ';
				$i = 0;

				foreach($condition as $key => $value){
					$pre = ($i > 0)?' AND ':'';
					$whereSql .= $pre.$key." = '".$value."'";
					$i++;
				}
			}

			$sql = "UPDATE ".$table." SET ".$colvalSet.$whereSql;
			$query = $this->db->prepare($sql);
			$update = $query->execute();
			return $update ? $query->rowCount() : false;

		}else{
			return false;
		}
	}
	
	public function delete($table,$condition){
		$whereSql = '';
		if(!empty($condition)&& is_array($condition)){
			$whereSql .= ' WHERE ';
			$i = 0;
			foreach($condition as $key => $value){
				$pre = ($i > 0)?' AND ':'';
				$whereSql .= $pre.$key." = '".$value."'";
				$i++;
			}
		}

		$sql = "DELETE FROM ".$table.$whereSql;
		$delete = $this->db->exec($sql);
		return $delete ? $delete : false;
	}

	//for renaming files
	public function upload_file($file) {
		if(isset($file)) {
			$extension = explode('.', $file['name']);
            $new_name = rand() . '.' . $extension[1];    
            return $new_name;  
        }  
	}
}