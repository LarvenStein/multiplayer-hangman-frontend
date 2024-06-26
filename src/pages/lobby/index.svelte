<script>
  import { userIdKey, roomCodeKey } from '../../config.ts'
  export let roomCode = localStorage.getItem(roomCodeKey)
  export let userId = localStorage.getItem(userIdKey)
</script>

<h1>{roomCode}</h1>
<h2>{userId}</h2>
