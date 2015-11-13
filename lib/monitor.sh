#!/bin/zsh
cd /var/www/super_projects/ad_market
RAILS_ENV=production bundle exec rake pack_monitor:start
