namespace :pack_monitor do

  desc "Start to monitor the projects"
  task :start, [] => :environment do |t, args|
    now = Time.now.to_i
    while Time.now.to_i-now <55 do
      monitor
      sleep(1)
    end

  end

  private
  #开始监控
  def monitor
    DirectoriesController::PROJECTS.values.select { |project|
      super_pack_locking = SuperPack.locking?(project[:name])
      super_pack_running = SuperPack.running?(project[:name])
      puts "#{project[:name]}\tlocking? #{super_pack_locking}\t running? #{super_pack_running}"
      super_pack_locking && !super_pack_running
    }.each { |project|
      SuperPack.run(project[:name])
      puts "\n[run] #{project[:name]} is now running"
      super_pack(project[:name])
    }
  end

  #super pack
  def super_pack(project_name)
    project = DirectoriesController::PROJECTS[project_name]
    flavor_path = "#{DirectoriesController::PROJECTS_ROOT}/#{project[:path]}"
    build_path = flavor_path.gsub('/flavors', '')
    #TODO 打特定的包
    # puts `cd #{build_path} && gradle clean && gradle build`
    puts `ls #{build_path}`
    #TODO:移动包到指定的目录
    SuperPack.unlock(project[:name])
    SuperPack.stop(project[:name])
  end

end