<script>
  import { TabsTransition } from '@roxi/routify/decorators'
  import * as signalR from '@microsoft/signalr';
  import { apiUrl } from '../config';
</script>

<div>
  <slot decorator={TabsTransition} />
</div>
