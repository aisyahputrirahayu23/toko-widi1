<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email|max:255',
            'password' => 'required|string|min:6',
        ], [
            'email.required'    => 'Email wajib diisi.',
            'email.email'       => 'Format email tidak valid.',
            'email.max'         => 'Email maksimal 255 karakter.',
            'password.required' => 'Password wajib diisi.',
            'password.string'   => 'Password harus berupa teks.',
            'password.min'      => 'Password minimal 6 karakter.',
        ]);

        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Email atau password salah.'], 401);
        }

        $user = Auth::user();
        $token = Str::random(60);
        $user->update(['api_token' => $token]);

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'          => $user->id,
                'name'        => $user->name,
                'email'       => $user->email,
                'role'        => $user->role,
                'foto_profil' => $user->foto_profil,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user('api')?->update(['api_token' => null]);

        return response()->json(['message' => 'Logout berhasil']);
    }

    public function me(Request $request)
    {
        $user = $request->user('api');

        return response()->json([
            'id'          => $user->id,
            'name'        => $user->name,
            'email'       => $user->email,
            'role'        => $user->role,
            'foto_profil' => $user->foto_profil,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user('api');

        $request->validate([
            'name'        => 'sometimes|string|max:255',
            'email'       => "sometimes|email|max:255|unique:users,email,{$user->id}",
            'foto_profil' => 'sometimes|nullable|string',
        ], [
            'name.max'      => 'Nama maksimal 255 karakter.',
            'email.email'   => 'Format email tidak valid.',
            'email.unique'  => 'Email sudah digunakan.',
        ]);

        $data = [];
        if ($request->has('name')) {
            $data['name'] = $request->name;
        }
        if ($request->has('email')) {
            $data['email'] = $request->email;
        }
        if ($request->has('foto_profil')) {
            $data['foto_profil'] = $request->foto_profil;
        }

        $user->update($data);

        return response()->json([
            'id'          => $user->id,
            'name'        => $user->name,
            'email'       => $user->email,
            'role'        => $user->role,
            'foto_profil' => $user->foto_profil,
        ]);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'password_lama'     => 'required|string',
            'password_baru'     => 'required|string|min:6',
            'konfirmasi'        => 'required|string|same:password_baru',
        ], [
            'password_lama.required'  => 'Password lama wajib diisi.',
            'password_baru.required'  => 'Password baru wajib diisi.',
            'password_baru.min'       => 'Password baru minimal 6 karakter.',
            'konfirmasi.required'     => 'Konfirmasi password wajib diisi.',
            'konfirmasi.same'         => 'Konfirmasi password tidak cocok.',
        ]);

        $user = $request->user('api');

        if (!Hash::check($request->password_lama, $user->password)) {
            return response()->json(['message' => 'Password lama tidak sesuai.'], 422);
        }

        $user->update(['password' => $request->password_baru]);

        return response()->json(['message' => 'Password berhasil diubah.']);
    }
}
