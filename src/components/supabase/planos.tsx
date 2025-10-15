import type { Plano } from '@/types/plano'
import { supabase } from '@/lib/supabaseClient'

export const fetchPlanos = async (): Promise<Plano[] | null> => {
    const { data, error } = await supabase
        .from('plano')
        .select('*')

    if (error) {
        console.error('Error al obtener planos:', error)
        return null
    }

    return data as Plano[]
}

export const createPlano = async (payload: Partial<Plano>): Promise<Plano | null> => {
    const { data, error } = await supabase
        .from('plano')
        .insert([payload])
        .select()
        .single()

    if (error) {
        console.error('Error al crear plano:', error)
        return null
    }

    return data as Plano
}

export const updatePlano = async (id_plano: string, payload: Partial<Plano>): Promise<Plano | null> => {
    const { data, error } = await supabase
        .from('plano')
        .update(payload)
        .eq('id_plano', id_plano)
        .select()
        .single()

    if (error) {
        console.error('Error al actualizar plano:', error)
        return null
    }

    return data as Plano
}

export const deletePlano = async (id_plano: string): Promise<boolean> => {
    const { error } = await supabase
        .from('plano')
        .delete()
        .eq('id_plano', id_plano)

    if (error) {
        console.error('Error al eliminar plano:', error)
        return false
    }

    return true
}

