import { describe, test, assert, beforeEach, afterEach, expect } from 'vitest'
import ColaPrioritariaImp from '../../src/repositories/ColaPrioritariaImp'
import Proceso from '../../src/models/Proceso'
import ProcesosController from '../../src/controllers/ProcesosController'
import ProcesosException from '../../src/errors/ProcesosException'
import { copyFileSync } from 'fs'

// definimos mock
// vi.mock('./../src/repositories/ColaPrioritariaImp', () => {
//   const ColaPrioritariaImp = vi.fn(() => ({
//     push: vi.fn(),
//     pop: vi.fn(),
//     isEmpty: vi.fn(),
//     getById: vi.fn(),
//     getAll: vi.fn(),
//     size: vi.fn(),
//   }))
//   return { ColaPrioritariaImp }
// })

// Describimos la suite
describe('Suite de test de Controlador de Procesos', () => {
  let colaPrioritaria: ColaPrioritariaImp
  let procesosController: ProcesosController

  // En cada test creamos la cola
  beforeEach(() => {
    colaPrioritaria = new ColaPrioritariaImp()
    procesosController = new ProcesosController(colaPrioritaria)
  })

  afterEach(() => {
    // vi.clearAllMocks()
  })

  test('debería obtener todos los procesos respetando prioridad', () => {
    const proceso1 = new Proceso(1, 'Proceso 1', 1)
    const proceso2 = new Proceso(2, 'Proceso 2', 2)
    colaPrioritaria.push(proceso1)
    colaPrioritaria.push(proceso2)

    const res = procesosController.getAll()

    expect(res).toEqual([proceso2, proceso1])
    assert.equal(res.length, 2)
    assert.equal(res[0], proceso2)
    assert.equal(res[1], proceso1)
    assert.isTrue(res[0].prioridad >= res[1].prioridad)
  })

  test('debería insertar un proceso', () => {
    const proceso1 = new Proceso(1, 'Proceso 1', 1)

    procesosController.push(proceso1)
    const res = procesosController.getAll()

    expect(res).toEqual([proceso1])
    assert.equal(res.length, 1)
    assert.equal(res[0], proceso1)
  })

  test('debería obtener un proceso', () => {
    const proceso1 = new Proceso(1, 'Proceso 1', 1)

    procesosController.push(proceso1)
    const res = procesosController.getById(1)

    assert.equal(res, proceso1)
  })

  test('debería sacar un proceso', () => {
    const proceso1 = new Proceso(1, 'Proceso 1', 1)

    procesosController.push(proceso1)
    const res = procesosController.pop()

    assert.equal(res, proceso1)
  })

  test('debería ser vacía', () => {
    const res = procesosController.isEmpty()

    assert.isTrue(res)
  })

  test('debería no ser vacía', () => {
    const proceso1 = new Proceso(1, 'Proceso 1', 1)

    procesosController.push(proceso1)

    const res = procesosController.isEmpty()

    assert.isFalse(res)
  })

  test('debería obtener una excepcion si proceso no existe al consultar', () => {
    const res = assert.throws(() => {
      procesosController.getById(1)
    }, ProcesosException)

    assert.isTrue(res.message.includes('No existe el proceso'))
  })

  test('debería obtener una excepcion si proceso no existe al extraer', () => {
    const res = assert.throws(() => {
      procesosController.pop()
    }, ProcesosException)

    assert.isTrue(res.message.includes('No existe el proceso'))
  })
})