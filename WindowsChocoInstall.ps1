if(!(Get-Command chocolatey -errorAction SilentlyContinue))
{
	echo "Installing Chocolatey Package Manager."
	if(iex ((new-object net.webclient).DownloadString('http://bit.ly/psChocInstall')))
	{
		SET PATH=%PATH%;%systemdrive%\chocolatey\bin
	}
	echo "Chocolatey Package Manager was installed. You MUST restart PowerShell to continue."
	
	$input=Read-Host "Restart Powershell! Press Y to confirm"
	while(!($input.ToLower() -eq "y"))
	{
		$input=Read-Host "Restart Powershell! Press Y to confirm"
	}
	
	return $false
}

$input=Read-Host "This script will install the default versions of Node, RabbitMQ, and MongoDB. If you have versions of this software already, you may wish to do these installs manually (or check this script). Press a key to continue."

choco install nodejs
choco install rabbitmq
choco install mongodb