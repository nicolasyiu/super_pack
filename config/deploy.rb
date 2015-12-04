# https://gist.github.com/stas/4539489
require 'mina/bundler'
require 'mina/rails'
require 'mina/git'
# require 'mina/rbenv'  # for rbenv support. (http://rbenv.org)
require 'mina/rvm' # for rvm support. (http://rvm.io)
require 'mina_notify'

# Basic settings:
#   domain       - The hostname to SSH to.
#   deploy_to    - Path to deploy into.
#   repository   - Git repo to clone from. (needed by mina/git)
#   branch       - Branch name to deploy. (needed by mina/git)

set :domains, ['112.124.104.41']
set :domain, '112.124.104.41'
set :deploy_to, '/var/www/super_pack'
set :repository, 'git@github.com:mumaoxi/super_pack.git'
set :branch, 'master'
# set :branch, 'develop'
set :keep_releases, 5
set :rails_env, :production

# Manually create these paths in shared/ (eg: shared/config/database.yml) in your server.
# They will be linked in the 'deploy:link_shared_paths' step.
set :shared_paths, ['config/database.yml', 'config/deploy.rb', 'config/puma.rb', 'log', 'public/apks', 'config/keystores', 'tmp']

# mina deploy to=s1
case ENV['to']
  when 's1'
    set :domain, '112.124.104.41' # production 1
end

case ENV['for']
  when 'master'
    set :branch, 'master'
  when 'develop'
    set :branch, 'develop'
  else
    if ENV['for']
      set :branch, ENV['for']
    end
end


# Optional settings:
set :user, 'root' # Username in the server to SSH to.
set :port, '22' # SSH port number.

set :rvm_path, '/usr/local/rvm/scripts/rvm'
set :app_path, lambda { "#{deploy_to}/#{current_path}" }
# This task is the environment that is loaded for most commands, such as
# `mina deploy` or `mina rake`.
task :environment do
  # If you're using rbenv, use this to load the rbenv environment.
  # Be sure to commit your .rbenv-version to your repository.
  # invoke :'rbenv:load'

  # For those using RVM, use this to load an RVM version@gemset.
  invoke :'rvm:use[ruby-2.1.5]'
end

# Put any custom mkdir's in here for when `mina setup` is ran.
# For Rails apps, we'll make some of the shared paths that are shared between
# all releases.
task :setup => :environment do
  MinaNotify.trigger_event(self, :setup)
  queue! %[mkdir -p "#{deploy_to}/shared/log"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/log"]

  queue! %[mkdir -p "#{deploy_to}/shared/public"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/public"]
  queue! %[mkdir -p "#{deploy_to}/shared/public/apks"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/public/apks"]

  queue! %[mkdir -p "#{deploy_to}/shared/tmp"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/tmp"]

  queue! %[mkdir -p "#{deploy_to}/shared/tmp/pids"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/tmp/pids"]

  queue! %[mkdir -p "#{deploy_to}/shared/tmp/sockets"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/tmp/sockets"]

  queue! %[mkdir -p "#{deploy_to}/shared/config"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/config"]
  queue! %[mkdir -p "#{deploy_to}/shared/config/keystores"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/config/keystores"]

  queue! %[touch "#{deploy_to}/shared/config/database.yml"]
  queue %[echo "-----> Be sure to edit 'shared/config/database.yml'."]

  queue! %[touch "#{deploy_to}/shared/config/puma.rb"]
  queue %[echo "-----> Be sure to edit 'shared/config/puma.rb'."]

end

# mina deploy:force_unlock deploy
# How to use: mina deploy to=s3 for=develop
# How to use: mina deploy to=s3 for=master
desc "Deploys the current version to the server."
task :deploy => :environment do
  MinaNotify.trigger_event(self, :deploy)
  deploy do
    # Put things that will set up an empty directory into a fully set-up
    # instance of your project.
    invoke :'git:clone'
    invoke :'deploy:cleanup'
    invoke :'deploy:link_shared_paths'
    invoke :'bundle:install'
    # queue 'bundle install -V'
    invoke :'rails:db_migrate'
    # queue 'rake assets:precompile'
    invoke :'rails:assets_precompile'

    to :launch do
      queue "cd #{app_path} ; bundle install --without nothing"
      invoke :restart
      # invoke :start
    end
  end
end

desc 'Starts the application'
task :start => :environment do
  MinaNotify.trigger_event(self, :start)
  queue %[echo "-----> #{rails_env}"]
  queue "cd #{app_path} ; bundle exec puma -C config/puma.rb -e #{rails_env} -d"
  # queue "cd #{app_path} ; bundle exec puma"
  # queue "cd #{app_path} ; bundle exec pumactl -F config/puma.rb start"
end

desc 'Stop the application'
task :stop => :environment do
  MinaNotify.trigger_event(self, :stop)
  queue "cd #{app_path} ; bundle exec pumactl -P #{app_path}/tmp/pids/puma.pid stop"
end

desc 'Restart the application'
task :restart => :environment do
  MinaNotify.trigger_event(self, :restart)
  # queue "cd #{app_path} ; bundle exec pumactl -P #{app_path}/tmp/pids/puma.pid restart"
  invoke :stop
  invoke :start
end

task :cat_server_log => :environment do
  queue "tail -n 200 #{app_path}/log/production.log"
end

task :cat_err_log => :environment do
  queue "tail -n 200 #{app_path}/log/puma.err.log"
end

desc "Deploy to all servers"
task :deploy_all do
  MinaNotify.trigger_event(self, :deploy_all)
  isolate do
    domains.each do |domain|
      set :domain, domain
      invoke :deploy
      run!
    end
  end
end

desc "Restart all servers"
task :restart_all do
  MinaNotify.trigger_event(self, :restart_all)
  isolate do
    domains.each do |domain|
      set :domain, domain
      invoke :restart
      run!
    end
  end
end

# For help in making your deploy script, see the Mina documentation:
#
#  - http://nadarei.co/mina
#  - http://nadarei.co/mina/tasks
#  - http://nadarei.co/mina/settings
#  - http://nadarei.co/mina/helpers
