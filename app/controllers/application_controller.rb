class ApplicationController < ActionController::Base
  include ApplicationHelper
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_filter :check_login_status

  #允许匿名访问的action
  ANONYMOUS_ACTIONS = [
      'p_users/login', #登录
      'p_users/logout' #退出登录
  ]

  private

  def check_login_status
    action = "#{controller_name}/#{action_name}"
    if !session[:user_id].present? && !ANONYMOUS_ACTIONS.include?(action)
      flash[:login_msg]='请登录后继续'
      return redirect_to login_path
    end
    @current_user = current_user
  end

end
