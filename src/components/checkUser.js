import { nicknameKey, roomCodeKey, userIdKey, apiUrl } from '../config.ts'

export function checkUser() {
  let roomCode = localStorage.getItem(roomCodeKey)
  let nickname = localStorage.getItem(nicknameKey)
  let userId = localStorage.getItem(userIdKey)

  if (roomCode == undefined) {
    window.location.href = '/'
    return
  }

  if (nickname == undefined) {
    window.location.href = `/join/${roomCode}`
    return
  }

  fetch(`${apiUrl}/games/${roomCode}/players`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'x-user-id': userId,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Server returned error')
      }
    })
    .catch((error) => {
      alert('The provided room is invalid!\n' + error)
      window.location.href = '/'
    })
}
