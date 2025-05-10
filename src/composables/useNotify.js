import { ref } from 'vue'

const Title = ref(null)
const Message = ref(null)
const Type = ref('warning')
const IsToastVisible = ref(false);
const NotifyElement = ref()
export default function useNotify() {
  const setNotifyElement = (ref) => {
    NotifyElement.value = ref
  }
  const setNotify = ({
      title, message, type = 'warning', isToastVisible = false
                     }) => {
    Title.value = title
    Message.value = message
    Type.value = type
    IsToastVisible.value = isToastVisible
    NotifyElement.value?.show()
  }

  return {
    Title,
    Message,
    Type,
    IsToastVisible,
    setNotify,
    setNotifyElement
  }
}
