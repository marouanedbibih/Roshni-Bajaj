<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\UserStoreRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Models\User;

use App\Http\Controllers\Tools\ImageController;
use App\Http\Requests\User\UserUpdateRequest;

class UserController extends Controller
{
    protected $imageController;
    public function __construct(ImageController $imageController)
    {
        $this->imageController = $imageController;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::select('id', 'last_name', 'first_name', 'email', 'created_at')
            ->orderBy('created_at', 'desc')
            ->paginate(7);
        return UserResource::collection($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserStoreRequest $request)
    {
        $data = $request->validated();
        /** @var \App\Models\User $user */
        $user = User::create($data);
        return response([
            'message' => 'User add sucufuly',
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserUpdateRequest $request, User $user)
    {
        $data = $request->validated();
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }
        /** @var \App\Models\User $user */
        $user->update($data);
        return response([
            'message' => 'User update sucufuly',
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return response([
            "message" => "user delete succufuly"
        ], 204);
    }
}
