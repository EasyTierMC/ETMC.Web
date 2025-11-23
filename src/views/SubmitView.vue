<template>
  <div class="flex justify-center px-4">
    <div class="w-full max-w-7xl">
      <div class="text-center">
        <h2 class="text-3xl font-bold mb-2">提交节点</h2>
        <p class="text-base-content/70 mb-6">填写以下信息提交新的 EasyTier 节点</p>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <!-- 节点信息卡片 -->
        <div class="lg:col-span-2">
          <div class="card bg-base-100 shadow-lg h-full">
            <div class="card-body">
              <h3 class="card-title text-xl mb-4">节点信息</h3>
              <form @submit.prevent="handleCreateNode" class="grid gap-4">

            <!-- 基础信息 -->
            <div class="space-y-4">
              <label class="form-control w-full">
                <div class="label">
                  <span class="label-text">节点名称 <span class="text-error">*</span></span>
                </div>
                <input v-model="nodeForm.name" type="text" placeholder="例如：北京联通节点" class="input input-bordered w-full"
                  required />
              </label>

              <label class="form-control w-full">
                <div class="label">
                  <span class="label-text">主机地址 <span class="text-error">*</span></span>
                </div>
                <input v-model="nodeForm.host" type="text" placeholder="例如：example.com 或 192.168.1.1"
                  class="input input-bordered w-full" required />
              </label>

              <div class="grid md:grid-cols-2 gap-4">
                <label class="form-control w-full">
                  <div class="label">
                    <span class="label-text">端口 <span class="text-error">*</span></span>
                  </div>
                  <input v-model.number="nodeForm.port" type="number" placeholder="例如：11010" class="input input-bordered w-full"
                    min="1" max="65535" required />
                </label>

                <label class="form-control w-full">
                  <div class="label">
                    <span class="label-text">最大连接数 <span class="text-error">*</span></span>
                  </div>
                  <input v-model.number="nodeForm.max_connections" type="number" placeholder="例如：10"
                    class="input input-bordered w-full" min="1" required />
                </label>
              </div>
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
                <input v-model="nodeForm.allow_relay" type="checkbox" class="checkbox checkbox-primary rounded-box" />
                <span class="label-text">允许中继连接</span>
              </label>
            </div>

            <!-- 网络配置 -->
            <div class="divider">网络配置</div>

            <div class="space-y-4">
              <label class="form-control w-full">
                <div class="label">
                  <span class="label-text">网络名称<span class="text-error">*</span></span>
                </div>
                <input v-model="nodeForm.network_name" type="text" placeholder="默认网络" class="input input-bordered w-full"
                  required />
              </label>

              <label class="form-control w-full">
                <div class="label">
                  <span class="label-text">网络密钥<span class="text-error">*</span></span>
                </div>
                <input v-model="nodeForm.network_secret" type="password" placeholder="请输入网络密钥"
                  class="input input-bordered w-full" required />
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

            <div class="space-y-4">
              <label class="form-control w-full">
                <div class="label">
                  <span class="label-text">QQ 号码</span>
                </div>
                <input v-model="nodeForm.qq_number" type="text" placeholder="例如：123456789"
                  class="input input-bordered w-full" />
              </label>

              <label class="form-control w-full">
                <div class="label">
                  <span class="label-text">邮箱地址</span>
                </div>
                <input v-model="nodeForm.mail" type="email" placeholder="例如：admin@example.com"
                  class="input input-bordered w-full" />
              </label>
            </div>

            <!-- 描述 -->
            <label class="form-control w-full">
              <div class="label">
                <span class="label-text">节点描述</span>
              </div>
              <textarea v-model="nodeForm.description" placeholder="介绍一下这个节点..."
                class="textarea textarea-bordered h-24 w-full"></textarea>
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
        </div>

        <!-- 建议卡片 -->
        <div class="lg:col-span-1">
          <div class="card bg-base-100 shadow-lg h-full">
            <div class="card-body">
              <h3 class="card-title text-lg mb-4">
                <span class="badge badge-info badge-sm">建议</span>
                节点配置建议
              </h3>
              
              <div class="space-y-4">
                <!-- 协议建议 -->
                <div class="alert alert-info">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <h4 class="font-semibold">协议选择</h4>
                    <p class="text-sm mt-1">非中继节点建议使用 WSS/WS 协议并配置 CDN，可有效防止 DDoS 攻击。中继节点建议使用 TCP/UDP 协议，WS/WSS 协议可能影响连接的延迟。</p>
                  </div>
                </div>

                <!-- 安全建议 -->
                <div class="alert alert-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  <div>
                    <h4 class="font-semibold">节点要求</h4>
                    <p class="text-sm mt-1">地理位置必须在中国大陆内，若是禁中转，CDN可选海外。服务器必须仅允许easytier应用访问中国大陆网络！确保您的节点稳定运行，具有良好的网络连接！</p>
                  </div>
                </div>

                <!-- 性能建议 -->
                <div class="alert alert-success">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <h4 class="font-semibold">性能优化</h4>
                    <p class="text-sm mt-1">根据服务器带宽合理设置最大连接数，建议预留 20% 带宽余量（峰值200Mbps算成最低40Mbps）。</p>
                  </div>
                </div>

                <!-- 联系方式建议 -->
                <div class="alert alert-ghost">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <h4 class="font-semibold">联系方式</h4>
                    <p class="text-sm mt-1">建议提供有效的联系方式，方便管理员在节点出现问题时及时联系。</p>
                  </div>
                </div>
              </div>

              <!-- 快速链接 -->
              <div class="divider">快速链接</div>
              <div class="flex flex-wrap gap-2">
                <a href="#" class="btn btn-outline btn-xs">EasyTier 文档</a>
                <a href="#" class="btn btn-outline btn-xs">配置教程</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-6">
        <p v-if="!nodeForm.allow_relay" class="text-warning">⚠提示：非中继节点推荐使用wss或ws协议并套上CDN以防止节点源站服务器遭受到DDos攻击！</p>
        <p v-if="nodeForm.allow_relay && (nodeForm.protocol === 'ws' || nodeForm.protocol === 'wss')" class="text-warning">
          ⚠提示：中继节点选择ws或wss协议可能会让节点使用者载着马斯克的星舰前往火星并访问地球互联网！</p>
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
  if (!nodeForm.value.name || !nodeForm.value.host || !nodeForm.value.network_name || !nodeForm.value.network_secret) return
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
