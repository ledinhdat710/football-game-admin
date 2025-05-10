import { ref } from 'vue'

const userInfo = ref(null)
export default function useAuth() {
  const resetUser = () => {
    userInfo.value = null
  }
  const setUser = (data) => {
    userInfo.value = data
  }

  return {
    userInfo,
    resetUser,
    setUser
  }
}
