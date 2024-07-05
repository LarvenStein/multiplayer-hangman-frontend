<script>
  import { TabsTransition } from '@roxi/routify/decorators'

  window.onbeforeunload = function(e) {
    if(window.location.pathname .startsWith("/lobby") || window.location.pathname.startsWith("/round")) {
      const confirmationMessage = "If you reload, you will be disconnected from the game, do you want to do that?";
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    }
  };
</script>

<div>
  <slot decorator={TabsTransition} />
</div>
