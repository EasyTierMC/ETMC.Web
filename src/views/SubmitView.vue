<template>
  <div class="flex justify-center px-4">
    <div class="w-full max-w-3xl">
      <h2 class="text-3xl font-bold mb-2">提交节点</h2>
      <p class="text-base-content/70 mb-6">填写以下信息提交新的 EasyTier 节点</p>

      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <h3 class="card-title text-xl mb-4">节点信息</h3>
          <form @submit.prevent="handleCreateNode" class="grid gap-4">

            <!-- 基础信息 -->
            <div class="grid md:grid-cols-2 gap-4">
              <label class="form-control">
                <div class="label">
                  <span class="label-text">节点名称 <span class="text-error">*</span></span>
                </div>
                <input v-model="nodeForm.name" type="text" placeholder="例如：北京联通节点" class="input input-bordered"
                  required />
              </label>

              <label class="form-control">
                <div class="label">
                  <span class="label-text">主机地址 <span class="text-error">*</span></span>
                </div>
                <input v-model="nodeForm.host" type="text" placeholder="例如：example.com 或 192.168.1.1"
                  class="input input-bordered" required />
              </label>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <label class="form-control">
                <div class="label">
                  <span class="label-text">端口 <span class="text-error">*</span></span>
                </div>
                <input v-model.number="nodeForm.port" type="number" placeholder="例如：11010" class="input input-bordered"
                  min="1" max="65535" required />
              </label>

              <label class="form-control">
                <div class="label">
                  <span class="label-text">最大连接数 <span class="text-error">*</span></span>
                </div>
                <input v-model.number="nodeForm.max_connections" type="number" placeholder="例如：10"
                  class="input input-bordered" min="1" required />
              </label>
            </div>

            <!-- 协议选择 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">协议 <span class="text-error">*</span></span>
              </label>
              <div class="flex gap-4 flex-wrap">
                <label class="label cursor-pointer gap-2">
                  <input v-model="nodeForm.protocol" type="radio" value="tcp" class="radio radio-primary" required />
                  <span>TCP</span>
                </label>
                <label class="label cursor-pointer gap-2">
                  <input v-model="nodeForm.protocol" type="radio" value="udp" class="radio radio-primary" />
                  <span>UDP</span>
                </label>
                <label class="label cursor-pointer gap-2">
                  <input v-model="nodeForm.protocol" type="radio" value="ws" class="radio radio-primary" />
                  <span>WS</span>
                </label>
                <label class="label cursor-pointer gap-2">
                  <input v-model="nodeForm.protocol" type="radio" value="wss" class="radio radio-primary" />
                  <span>WSS</span>
                </label>
              </div>
            </div>

            <!-- 允许中继 -->
            <div class="form-control">
              <label class="label cursor-pointer justify-start gap-3">
                <input v-model="nodeForm.allow_relay" type="checkbox" class="checkbox checkbox-primary" />
                <span class="label-text">允许中继连接</span>
              </label>
            </div>

            <!-- 网络配置 -->
            <div class="divider">网络配置</div>

            <div class="grid md:grid-cols-2 gap-4">
              <label class="form-control">
                <div class="label">
                  <span class="label-text">网络名称<span class="text-error">*</span></span>
                </div>
                <input v-model="nodeForm.network_name" type="text" placeholder="默认网络" class="input input-bordered" required/>
              </label>

              <label class="form-control">
                <div class="label">
                  <span class="label-text">网络密钥<span class="text-error">*</span></span>
                </div>
                <input v-model="nodeForm.network_secret" type="password" placeholder="请输入网络密钥"
                  class="input input-bordered" required/>
              </label>
            </div>

            <!-- 地理位置 -->
            <!-- <div class="divider">地理位置</div>

            <div class="grid md:grid-cols-2 gap-4">
              <label class="form-control">
                <div class="label">
                  <span class="label-text">区域位置</span>
                </div>
                <input v-model="nodeForm.region" type="text" placeholder="例如：华北、华东" class="input input-bordered" />
              </label>

              <label class="form-control">
                <div class="label">
                  <span class="label-text">运营商</span>
                </div>
                <input v-model="nodeForm.ISP" type="text" placeholder="例如：电信、联通、移动" class="input input-bordered" />
              </label>
            </div> -->

            <!-- 联系方式 -->
            <div class="divider">联系方式</div>

            <div class="grid md:grid-cols-2 gap-4">
              <label class="form-control">
                <div class="label">
                  <span class="label-text">QQ 号码</span>
                </div>
                <input v-model="nodeForm.qq_number" type="text" placeholder="例如：123456789"
                  class="input input-bordered" />
              </label>

              <label class="form-control">
                <div class="label">
                  <span class="label-text">邮箱地址</span>
                </div>
                <input v-model="nodeForm.mail" type="email" placeholder="例如：admin@example.com"
                  class="input input-bordered" />
              </label>
            </div>

            <!-- 描述 -->
            <label class="form-control">
              <div class="label">
                <span class="label-text">节点描述</span>
              </div>
              <textarea v-model="nodeForm.description" placeholder="介绍一下这个节点..."
                class="textarea textarea-bordered h-24"></textarea>
            </label>

            <!-- 提交按钮 -->
            <div class="card-actions justify-end mt-4">
              <button type="button" class="btn btn-ghost" @click="resetForm">重置</button>
              <button type="submit" class="btn btn-primary" :disabled="submitting">
                <span v-if="submitting" class="loading loading-spinner loading-sm"></span>
                <span>{{ submitting ? '提交中...' : '提交节点' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="text-center">
        <p v-if="!nodeForm.allow_relay" class="text-warning">⚠提示：非中继节点推荐使用wss或ws协议并套上CDN以防止节点源站服务器遭受到DDos攻击！</p>
        <p v-if="nodeForm.allow_relay&&(nodeForm.protocol==='ws'||nodeForm.protocol==='wss')" class="text-warning">⚠提示：中继节点选择ws或wss协议可能会让节点使用者载着马斯克的星舰前往火星并访问地球互联网！</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createNode } from '@/utils/request/api'
import { ref } from 'vue'

interface INodefrom {
  name: string;
  host: string;
  port: number;
  protocol: 'tcp' | 'udp' | 'ws' | 'wss';
  allow_relay: boolean;
  network_name: string | null;
  network_secret: string | null;
  max_connections: number;
  region: string | null;
  ISP: string | null;
  qq_number: string | null;
  mail: string | null;
  description: string;
}

const nodeForm = ref<INodefrom>({
  name: '',
  host: '',
  port: 11010,
  protocol: 'tcp',
  allow_relay: true,
  network_name: null,
  network_secret: null,
  max_connections: 100,
  region: null,
  ISP: null,
  qq_number: null,
  mail: null,
  description: ''
})

const submitting = ref(false)

function resetForm() {
  nodeForm.value = {
    name: '',
    host: '',
    port: 11010,
    protocol: 'tcp',
    allow_relay: true,
    network_name: null,
    network_secret: null,
    max_connections: 100,
    region: null,
    ISP: null,
    qq_number: null,
    mail: null,
    description: ''
  }
}

async function handleCreateNode() {
  if (!nodeForm.value.name || !nodeForm.value.host) return
  submitting.value = true
  try {
    await createNode(nodeForm.value)
    alert('节点创建成功！')
    resetForm()
  } catch (e: any) {
    alert('创建节点失败: ' + (e.message || e))
  } finally {
    submitting.value = false
  }
}
</script>
