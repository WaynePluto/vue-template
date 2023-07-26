export default defineComponent(() => {
  const count = ref(0)
  const add = () => {
    count.value++
  }
  return () => (
    <>
      <span onClick={add}>counter:{count.value}</span>
    </>
  )
})
