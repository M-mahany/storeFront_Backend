import supertest from 'supertest'
import Orders, { Order, productOrders } from '../models/orders'
import app from '../server'

const request = supertest(app)

describe('testing main orders routes handler path', () => {
  let admintoken: string
  it('login to get token and proceed with testing', async () => {
    await request
      .get('/auth/login')
      .send({
        username: 'adminuser',
        password: '123456',
      })
      .expect(200)
      .expect((response) => {
        admintoken = response.body
      })
  })

  it('creating new order', () => {
    request
      .post('/users/1/orders/')
      .auth(admintoken, { type: 'bearer' })
      .send({
        status: 'active',
      })
      .expect(200)
  })

  it('ADD product to order', () => {
    request
      .post('/users/1/orders/1')
      .auth(admintoken, { type: 'bearer' })
      .send({
        product_id: 1,
        quantity: 2,
      })
      .expect(200)
  })
  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
  })

  it('show order by id', () => {
    request
      .get('/users/1/orders')
      .auth(admintoken, { type: 'bearer' })
      .expect(200)
  })

  it('Update order status by id', () => {
    request
      .put('/users/1/orders/1')
      .auth(admintoken, { type: 'bearer' })
      .send({
        status: 'complete',
      })
      .expect(200)
  })
})

describe('testing orders models', () => {
  const Order: Order = {
    user_id: 1,
    status: 'active',
  }
  const Product: productOrders = {
    order_id: 2,
    product_id: 2,
    quantity: 1,
  }

  it('testing Creating new order', () => {
    const response = Orders.create(Order)
    expect(response).toBeDefined()
  })

  it('testing adding product to order', () => {
    const response = Orders.addProductToOrder(Product)
    expect(response).toBeDefined()
  })
})
