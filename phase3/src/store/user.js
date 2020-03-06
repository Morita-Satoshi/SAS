import api from './api'
import config from '../assets/config'

const defaultState = {
  username: null,
  accessToken: null,
  refreshToken: null,
  authenticated: false,
  lastAPICalledAt: null,
  identityID: null
}

export const state = () => (JSON.parse(JSON.stringify(defaultState)))

export const getters = {
  username(state) {
    return state.username
  },
  accessToken(state) {
    return state.accessToken
  },
  refreshToken(state) {
    return state.refreshToken
  },
  authenticated(state) {
    return state.authenticated
  },
  lastAPICalledAt(state) {
    return state.lastAPICalledAt
  },
  identityID(state) {
    return state.identityID
  }

}

export const mutations = {
  update(state, payload) {
    if (payload.username != undefined)
      state.username = payload.username

    if (payload.accessToken != undefined)
      state.accessToken = payload.accessToken

    if (payload.refreshToken != undefined)
      state.refreshToken = payload.refreshToken

    if (payload.authenticated != undefined)
      state.authenticated = payload.authenticated

    if (payload.lastAPICalledAt != undefined)
      state.lastAPICalledAt = payload.lastAPICalledAt

    if (payload.identityID != undefined)
      state.identityID = payload.identityID
  },
  reset(state) {
    Object.assign(state, JSON.parse(JSON.stringify(defaultState)))
  }
}

export const actions = {
  login(context, payload) {
    return new Promise((resolve, reject) => {
      const body = {
        'username': payload.username,
        'password': payload.password,
        'PoolId': config.PoolId,
        'ClientId': config.ClientId
      }
      console.log(body)
      api.post('/login', body).then((resp) => {
        context.commit('update', {
          username: payload.username,
          accessToken: resp.data.AuthenticationResult.AccessToken,
          refreshToken: resp.data.AuthenticationResult.RefreshToken,
          authenticated: true,
          lastAPICalledAt: resp.data.ResponseMetadata.HTTPHeaders.date,
          identityID: resp.data.AuthenticationResult.IdentityID
        })
        resolve(resp)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  logout(context) {
    return new Promise((resolve, reject) => {
      const body = {
        'AccessToken': context.getters['accessToken']
      }
      api.post('/logout', body).then((resp) => {
        context.commit('reset')
        resolve(resp)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  verify(context) {
    return new Promise((resolve, reject) => {
      api.get('/verify').then((resp) => {
        resolve(resp)
      }).catch((error) => {
        context.commit('reset')
        reject(error)
      })
    })
  }
}