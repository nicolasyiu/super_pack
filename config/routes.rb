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

  root 'super_packs#index'
end
