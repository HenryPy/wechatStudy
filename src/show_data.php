<?php
$servername = "localhost"; 
$username = $_GET['name'];      
$password = $_GET['password'];   
$database = $_GET['database'];   



$conn = new mysqli($servername,$username,$password,$database);

if($conn->connect_error){
    die("连接失败:" . $conn->connect_error);
}

$sql = "select x.id,x.time,x.warnid,d.warntext from alarmxinxi as x left join duizhaobiao as d on x.warnid = d.warnum;;";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
// 输出数据
while($row = $result->fetch_assoc()) {
    echo  "id: " . $row["id"]. " 报警时间: " . $row["time"]. " 报警项: " . $row["warnid"]." 报警内容: " . $row["warntext"]. " " ;
}
} else {
echo "0 结果";
}
$conn->close();

?>