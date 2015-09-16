vm_hostname = "BGGC"

Vagrant.configure(2) do |config|

  config.vm.provider :virtualbox do |vb, override|
    vb.name = "local-bggc"
    vb.customize ["modifyvm", :id, "--memory", "1024"]
    override.vm.box = 'ubuntu/trusty64'
    override.vm.network "forwarded_port", guest: 80, host: 7090
  end

  config.vm.provision :ansible do |ansible|
    ansible.playbook = 'provision/playbook.yml'
    ansible.groups = {
      "webservers" => ["default", "local"]
    }
    ansible.sudo = true
  end

  config.vm.define :local do |t|
  end
end