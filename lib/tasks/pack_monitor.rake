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
    project = DirectoriesController::PROJECTS.values.select { |project|
      super_pack_locking = SuperPack.locking?(project[:name])
      super_pack_running = SuperPack.running?(project[:name])
      puts "#{project[:name]}\tlocking? #{super_pack_locking}\t running? #{super_pack_running}"
      super_pack_locking && !super_pack_running
    }[0]
    if project
      SuperPack.run(project[:name])
      puts "\n[run] #{project[:name]} is now running"
      super_pack(project[:name])
    end
  end

  #super pack
  def super_pack(project_name)
    project = DirectoriesController::PROJECTS[project_name]
    flavor_path = "#{DirectoriesController::PROJECTS_ROOT}/#{project[:path]}"
    build_path = flavor_path.gsub('/flavors', '')
    #TODO 打特定的包
    puts `cd #{build_path} && gradle clean && gradle build`
    puts `ls #{build_path}`

    #移动包到指定的目录
    json = SuperPack.lock_json(project_name)
    creator_path = "#{Rails.root}/public/apks/#{json['creator_id']}"
    creator_flavor_path = "#{creator_path}/#{json['flavor']}"
    creator_flavor_day_path = "#{creator_flavor_path}/#{Time.now.strftime('%Y%m%d')}"

    apks_url = "#{build_path}/build/outputs/apk/*release.apk"
    command_mv = "cp #{apks_url.gsub(' ', '\ ')} #{creator_flavor_day_path.gsub(' ', '\ ')}/"

    Dir.mkdir(creator_path, 0700) unless Dir.exist?(creator_path)
    Dir.mkdir(creator_flavor_path, 0700) unless Dir.exist?(creator_flavor_path)
    Dir.mkdir(creator_flavor_day_path, 0700) unless Dir.exist?(creator_flavor_day_path)

    puts command_mv
    puts `#{command_mv}`

    #解锁
    SuperPack.unlock(project_name)
    SuperPack.stop(project_name)
  end

end