Rails.application.routes.draw do


  resources :super_packs do
    collection do
      get :flavors
    end
  end

  resources :directories do
    collection do
      put :rename
      post :upload
    end
  end

  resources :p_users, only: [:show]

  get '/login', to: 'p_users#login'
  post '/login', to: 'p_users#login'
  get '/logout', to: 'p_users#logout'

  root 'super_packs#index'
end
