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
    .select('id, name, description, price, image, created_at')
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
    .select('id, name, description, price, image, created_at')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('Error fetching product:', error.message)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function submitCheckout(customer, cart, requestId) {
  if (!supabase) return configurationError('submitting checkout')

  const toText = (value) => (typeof value === 'string' ? value.trim() : '')
  const values = customer ?? {}
  const checkoutCustomer = {
    'full-name': toText(values['full-name']),
    phone: toText(values.phone),
    email: toText(values.email),
    'user-address': toText(values['user-address']),
  }

  if (
    !checkoutCustomer['full-name']
    || !checkoutCustomer.phone
    || !checkoutCustomer.email
    || !checkoutCustomer['user-address']
    || checkoutCustomer['full-name'].length > 120
    || checkoutCustomer.phone.length > 40
    || checkoutCustomer.email.length > 254
    || checkoutCustomer['user-address'].length > 500
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkoutCustomer.email)
    || typeof requestId !== 'string'
    || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)
  ) {
    return {
      data: null,
      error: new Error('Enter valid customer details and stay within the field length limits.'),
    }
  }

  if (
    !Array.isArray(cart)
    || cart.length === 0
    || cart.length > 100
    || cart.some((item) => (
      (typeof item.id !== 'string' && typeof item.id !== 'number')
      || !Number.isSafeInteger(item.quantity)
      || item.quantity < 1
      || item.quantity > 1_000_000
    ))
  ) {
    return {
      data: null,
      error: new Error('Your cart is empty or contains invalid product quantities.'),
    }
  }

  const items = cart.map(({ id, quantity }) => ({ id: String(id), quantity }))
  const { data, error } = await supabase.rpc('submit_checkout', {
    p_customer: checkoutCustomer,
    p_items: items,
    p_request_id: requestId,
  })

  if (error) {
    console.error(
      'Error submitting checkout:',
      error.code,
      error.message,
      error.hint
    )
    return { data: null, error }
  }

  return { data, error: null }
}
