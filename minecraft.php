<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Page Title</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" media="screen" href="css/reset.css" />
    <link rel="stylesheet" type="text/css" media="screen" href="css/main.css" />
    <script src="js/main.js"></script>
</head>
<body>
    <div id="overlay" >
		<iframe src="html/navbar.html" onload="navReset(),mobileSite()" id="iframeover"></iframe>
	</div>  
    
	<div class="space-50"></div>
    <div class="space-10"></div>
    
    
    <?php
	require 'php/MCPing.php';	
	
    $status = new MCPing();
    $server = $status->GetStatus( 'kinsaurralde.ddns.net', 25565 )->Response();
    $online = $server["online"];
    $ping = $server["ping"];
    $version = $server["version"];
    $protocol = $server["protocol"];
    $players = $server["players"];
    $max_players = $server["max_players"];
    $list = $server["sample_player_list"];
    $motd = $server["motd"];
    $mods = $server["mods"];
    ?>

    <p>Server Status: <span id="online"><?php if ($online == 1) { echo("Online");} else { echo("Offline");} ?></span></p>
    <p>Ping: <span id="ping"><?php echo($ping) ?></span>ms</p>
    <p>Version: <span id="version"><?php echo($version) ?></span></p>
    <p>Active Players: <span id="players"><?php echo($players) ?></span></p>
    <p>Max Players: <span id="max_players"><?php echo($max_players) ?></span></p>
    <p>Player 0: <span id="list"><?php echo($list[0]["name"]) ?></span></p>
    <p>Player 1: <span id="list"><?php echo($list[1]["name"]) ?></span></p>
    <p>Player 2: <span id="list"><?php echo($list[2]["name"]) ?></span></p>
    <p>Player 3: <span id="list"><?php echo($list[3]["name"]) ?></span></p>
    <p>Player 4: <span id="list"><?php echo($list[4]["name"]) ?></span></p>
    <p>Player 5: <span id="list"><?php echo($list[5]["name"]) ?></span></p>
    <p>MOTD: <span id="motd"><?php echo($motd) ?></span></p>
    <p>Mods: <span id="mods"><?php echo($mods) ?></span></p>
</body>
</html>

