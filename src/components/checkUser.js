import { nicknameKey, roomCodeKey, userIdKey, apiUrl } from '../config.ts'

export async function checkUser() {
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

  const resp = await fetch(`${apiUrl}/games/${roomCode}/players`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'x-user-id': userId,
    },
  })
  if (!resp.ok) {
    let error = 'Server returned error'
    alert('The provided room is invalid or the room is full!\n' + error)
    window.location.href = '/'
  }
}
