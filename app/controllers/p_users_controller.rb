class PUsersController < ApplicationController
  def show

  end

  def login
    if request.method=='POST'
      user = PUser.where(user_name: params[:user_name]).take
      input_pwd = Digest::MD5.hexdigest(params[:user_pwd])

      return flash[:login_msg]='用户不存在' unless user
      return flash[:login_msg]='密码不对' unless input_pwd==user.user_pwd

      session[:user_id] = user.id
      redirect_to root_path
    end
  end
end
