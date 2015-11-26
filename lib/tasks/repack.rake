namespace :repack do

  desc "Start to repack a apk file"
  task :start, [] => :environment do |t, args|
    now = Time.now.to_i
    while Time.now.to_i-now <55 do
      monitor
      sleep(1)
    end

  end

  

end