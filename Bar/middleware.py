from django.shortcuts import redirect

from django.shortcuts import redirect
from django.urls import resolve

class Bar_Middleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response
    
    def process_view(self, request, view_func, view_args, view_kwargs):
        user = request.user
        path = request.path
        
        if "/static" in path or "/media" in path or "/admin" in path:
            return None
        else:
            # Checks if the URL is valid
            try:    
                resolve(request.path)
            except:
                return redirect("bar:loginPage")

        if not user.is_authenticated:
            if not request.resolver_match.url_name in ['loginPage', 'checkLogin']:
                return redirect("bar:loginPage")