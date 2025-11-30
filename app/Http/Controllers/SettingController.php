<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    /**
     * Mostrar configuraciones del sistema
     */
    public function index()
    {
        $settings = Setting::all()->groupBy('group');

        return Inertia::render('Configuracion', [
            'settings' => $settings->map(function($group) {
                return $group->map(function($setting) {
                    return [
                        'id' => $setting->id,
                        'group' => $setting->group,
                        'name' => $setting->name,
                        'locked' => $setting->locked,
                        'payload' => $setting->payload,
                    ];
                });
            })
        ]);
    }

    /**
     * Actualizar una configuración
     */
    public function update(Request $request, $id)
    {
        $setting = Setting::findOrFail($id);

        // No permitir editar configuraciones bloqueadas
        if ($setting->locked) {
            return redirect()->back()->withErrors([
                'error' => 'Esta configuración está bloqueada y no puede ser modificada'
            ]);
        }

        $request->validate([
            'payload' => 'required|array',
        ]);

        $setting->update([
            'payload' => $request->payload,
        ]);

        return redirect()->back()->with('success', 'Configuración actualizada correctamente');
    }

    /**
     * Crear nueva configuración
     */
    public function store(Request $request)
    {
        $request->validate([
            'group' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'payload' => 'required|array',
        ]);

        // Verificar que no exista la combinación group + name
        $exists = Setting::where('group', $request->group)
                         ->where('name', $request->name)
                         ->exists();

        if ($exists) {
            return redirect()->back()->withErrors([
                'error' => 'Ya existe una configuración con ese nombre en el grupo especificado'
            ]);
        }

        Setting::create([
            'group' => $request->group,
            'name' => $request->name,
            'locked' => false,
            'payload' => $request->payload,
        ]);

        return redirect()->back()->with('success', 'Configuración creada correctamente');
    }

    /**
     * Eliminar configuración (solo si no está bloqueada)
     */
    public function destroy($id)
    {
        $setting = Setting::findOrFail($id);

        if ($setting->locked) {
            return redirect()->back()->withErrors([
                'error' => 'Esta configuración está bloqueada y no puede ser eliminada'
            ]);
        }

        $setting->delete();

        return redirect()->back()->with('success', 'Configuración eliminada correctamente');
    }

    /**
     * Método helper para obtener una configuración específica
     */
    public static function get($group, $name, $default = null)
    {
        $setting = Setting::where('group', $group)
                          ->where('name', $name)
                          ->first();

        return $setting ? $setting->payload : $default;
    }

    /**
     * Método helper para guardar/actualizar una configuración
     */
    public static function set($group, $name, $payload, $locked = false)
    {
        return Setting::updateOrCreate(
            ['group' => $group, 'name' => $name],
            ['payload' => $payload, 'locked' => $locked]
        );
    }
}