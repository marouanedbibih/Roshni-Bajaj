<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        // Check the user's role
        $user = $request->user();
        
        if ($user && in_array($user->role, $roles)) {
            return $next($request);
        }
        
        return response('Unauthorized.', 401);
    }
    
}
