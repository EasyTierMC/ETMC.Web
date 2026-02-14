<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  show: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  save: [data: any]
}>()

const formData = ref({
  name: '',
  description: '',
  ua: ''
})

watch(() => props.show, (newShow) => {
  if (newShow) {
    formData.value = {
      name: '',
      description: '',
      ua: ''
    }
  }
})

function handleClose() {
  emit('close')
}

function handleSave() {
  if (!formData.value.name.trim()) {
    alert('请输入 API Key 名称')
    return
  }
  emit('save', { ...formData.value })
}
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': show }">
    <div class="modal-box max-w-md">
      <h3 class="font-bold text-lg mb-4">创建 API Key</h3>
      <div class="space-y-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">API Key 名称 <span class="text-error">*</span></span>
          </label>
          <input v-model="formData.name" type="text" placeholder="输入 API Key 名称" class="input input-bordered input-sm w-full" />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">描述</span>
          </label>
          <textarea v-model="formData.description" placeholder="输入 API Key 描述" class="textarea textarea-bordered textarea-sm w-full" rows="2"></textarea>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">User-Agent (正则表达式)</span>
          </label>
          <input v-model="formData.ua" type="text" placeholder="例如: PCL/* 或 HMCL/*" class="input input-bordered input-sm w-full" />
          <label class="label">
            <span class="label-text-alt text-base-content/60">支持正则表达式，例如 PCL/* 匹配所有 PCL 开头的 UA</span>
          </label>
        </div>
      </div>
      <div class="modal-action">
        <button class="btn" @click="handleClose">取消</button>
        <button class="btn btn-primary" @click="handleSave">创建</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="handleClose">close</button>
    </form>
  </dialog>
</template>
