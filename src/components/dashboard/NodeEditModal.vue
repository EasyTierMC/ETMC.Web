<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  node: any
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
  network_name: '',
  network_key: '',
  host: '',
  port: 11010,
  protocol: 'wss',
  allow_relay: false,
  qq_number: '',
  mail: ''
})

const protocols = ['wss', 'quic', 'tcp', 'udp']

watch(() => props.node, (newNode) => {
  if (newNode) {
    formData.value = {
      name: newNode.name || '',
      description: newNode.description || '',
      network_name: newNode.network_name || '',
      network_key: newNode.network_key || '',
      host: newNode.host || '',
      port: newNode.port || 11010,
      protocol: newNode.protocol || 'wss',
      allow_relay: newNode.allow_relay || false,
      qq_number: newNode.qq_number || '',
      mail: newNode.mail || ''
    }
  }
}, { immediate: true })

function handleClose() {
  emit('close')
}

function handleSave() {
  if (!formData.value.name.trim()) {
    alert('请输入节点名称')
    return
  }
  if (!formData.value.host.trim()) {
    alert('请输入连接地址')
    return
  }
  if (!formData.value.port) {
    alert('请输入端口')
    return
  }
  if (!formData.value.network_name.trim()) {
    alert('请输入网络名称')
    return
  }
  if (!formData.value.network_key.trim()) {
    alert('请输入网络密钥')
    return
  }
  emit('save', { ...formData.value })
}
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': show }">
    <div class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg mb-4">编辑节点</h3>
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">节点名称 <span class="text-error">*</span></span>
            </label>
            <input v-model="formData.name" type="text" placeholder="输入节点名称" class="input input-bordered input-sm w-full" />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">协议</span>
            </label>
            <select v-model="formData.protocol" class="select select-bordered select-sm w-full">
              <option v-for="protocol in protocols" :key="protocol" :value="protocol">{{ protocol.toUpperCase() }}</option>
            </select>
          </div>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">节点描述</span>
          </label>
          <textarea v-model="formData.description" placeholder="输入节点描述" class="textarea textarea-bordered textarea-sm w-full" rows="2"></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">连接地址 <span class="text-error">*</span></span>
            </label>
            <input v-model="formData.host" type="text" placeholder="192.168.1.100" class="input input-bordered input-sm w-full" />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">端口 <span class="text-error">*</span></span>
            </label>
            <input v-model.number="formData.port" type="number" placeholder="11010" class="input input-bordered input-sm w-full" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">网络名称 <span class="text-error">*</span></span>
            </label>
            <input v-model="formData.network_name" type="text" placeholder="easytier-main" class="input input-bordered input-sm w-full" />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">网络密钥 <span class="text-error">*</span></span>
            </label>
            <input v-model="formData.network_key" type="password" placeholder="输入网络密钥" class="input input-bordered input-sm w-full" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">QQ号码</span>
            </label>
            <input v-model="formData.qq_number" type="text" placeholder="123456789" class="input input-bordered input-sm w-full" />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">邮箱</span>
            </label>
            <input v-model="formData.mail" type="email" placeholder="admin@example.com" class="input input-bordered input-sm w-full" />
          </div>
        </div>

        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">允许中继</span>
            <input v-model="formData.allow_relay" type="checkbox" class="checkbox checkbox-sm" />
          </label>
        </div>
      </div>
      <div class="modal-action">
        <button class="btn" @click="handleClose">取消</button>
        <button class="btn btn-primary" @click="handleSave">保存</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="handleClose">close</button>
    </form>
  </dialog>
</template>
