import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

function configurationError(operation) {
  const error = new Error(
    'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.'
  )
  console.error(`Error ${operation}:`, error.message)
  return { data: null, error }
}

export async function getProducts() {
  if (!supabase) return configurationError('fetching products')

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error.message)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function getProductById(id) {
  if (!supabase) return configurationError('fetching product')

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('Error fetching product:', error.message)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function createOrder(order) {
  if (!supabase) return configurationError('creating order')

  const { data, error } = await supabase
    .from('orders')
    .insert({
      customer_name: order.customer_name,
      phone: order.phone,
      address: order.address,
      product_id: order.product_id,
      quantity: order.quantity,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating order:', error.message)
    return { data: null, error }
  }

  return { data, error: null }
}
