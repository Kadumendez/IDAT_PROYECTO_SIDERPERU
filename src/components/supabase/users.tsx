import type { Usuario } from '@/types/usuario'
import { supabase } from '@/lib/supabaseClient'

export const fetchUsuarios = async (): Promise<Usuario[] | null> => {
    const { data, error } = await supabase
        .from('usuario')
        .select('*')

    if (error) {
        console.error('Error al obtener usuarios:', error)
        return null
    }

    return data as Usuario[]
}