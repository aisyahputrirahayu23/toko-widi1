<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::select('id', 'name', 'email', 'role', 'created_at')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'role'     => 'required|in:admin,karyawan',
        ], [
            'name.required'     => 'Nama wajib diisi.',
            'name.max'          => 'Nama maksimal 255 karakter.',
            'email.required'    => 'Email wajib diisi.',
            'email.email'       => 'Format email tidak valid.',
            'email.unique'      => 'Email sudah digunakan.',
            'password.required' => 'Password wajib diisi.',
            'password.min'      => 'Password minimal 6 karakter.',
            'role.required'     => 'Role wajib dipilih.',
            'role.in'           => 'Role tidak valid.',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => $request->password,
            'role'     => $request->role,
        ]);

        return response()->json($user->only('id', 'name', 'email', 'role', 'created_at'), 201);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name'     => 'sometimes|string|max:255',
            'email'    => "sometimes|email|max:255|unique:users,email,{$user->id}",
            'password' => 'sometimes|nullable|string|min:6',
            'role'     => 'sometimes|in:admin,karyawan',
        ], [
            'name.max'       => 'Nama maksimal 255 karakter.',
            'email.email'    => 'Format email tidak valid.',
            'email.unique'   => 'Email sudah digunakan pengguna lain.',
            'password.min'   => 'Password minimal 6 karakter.',
            'role.in'        => 'Role tidak valid.',
        ]);

        $data = $request->only(['name', 'email', 'role']);

        if ($request->filled('password')) {
            $data['password'] = $request->password;
        }

        $user->update($data);

        return response()->json($user->only('id', 'name', 'email', 'role', 'created_at'));
    }

    public function destroy(Request $request, User $user)
    {
        if ($request->user('api')->id === $user->id) {
            return response()->json(['message' => 'Tidak bisa menghapus akun sendiri.'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User berhasil dihapus.']);
    }
}
