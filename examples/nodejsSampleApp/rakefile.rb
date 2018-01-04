require 'rake'

# This file will work for nodejs function

# Deploying the lambda and API gateway
# Technology or runtime independent
task :deploy,[:option] => [:package] do |t,args|
  puts 'Deploying to env ' + args[:option]
  raise 'error' if !system('node deploy.js ' + args[:option])
end

# This task is technology dependent.
# Will create a zip to be uploaded to lambda
task :package => [:install_nodules] do
  puts 'creating package to deploy'
  raise 'installing dependencies' if !system('deploy.bat')
end

task :install_nodules do |t|
  puts 'Installing modules for deployment'
  raise 'error in deploying modules' if !system('npm install')
end
