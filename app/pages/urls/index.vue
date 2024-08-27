<script setup lang="ts">
import {
  Delete as IconDelete,
  Refresh as IconRefresh,
  Plus as IconPlus,
  Edit as IconEdit,
  Promotion as IconPromotion,
} from '@element-plus/icons-vue'
import type { FormItemRule, FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import logger from '~~/app/composables/logger'

interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

interface Url {
  id: number
  url: string
  shortCode?: string
  expiresIn?: string
  expirationDate?: number | string
}

interface Urls {
  id: number // 主键ID
  shortCode: string // 短代码
  url: string // 原始URL
  expirationDate?: number // 过期日期（可选）
  ogTitle?: string // OG标题（可选）
  ogDescription?: string // OG描述（可选）
  ogImage?: string // OG图片URL（可选）

  // 分析数据
  analytics?: {
    shortCode: string // 短链接
    clickCount: number // 点击次数
  }
}

type LoadingCallback = () => Promise<void>

const {
  public: { redirectUrl },
} = useRuntimeConfig()
logger.log('🚀 ~ redirectUrl:', redirectUrl)

// Variables
const isLoadingTable = ref(false)
const urlsList = ref<Urls[]>([])
const isDialogVisible = ref(false)
const userFormRef = ref<FormInstance>()
const urlsForm = ref<Url>({
  id: 0,
  url: '',
  shortCode: '',
  expiresIn: '',
})
const isSubmitting = ref(false)

// Computed
const isEditingUser = computed(() => !!urlsForm.value.id)

// Functions
async function loadUrlsData() {
  await handleLoading(async () => {
    const { data } = await $fetch<ApiResponse<Urls[]>>('/api/urls')

    urlsList.value = data || []
  })
}

async function handleLoading(callback: LoadingCallback) {
  isLoadingTable.value = true
  try {
    await callback()
  } finally {
    isLoadingTable.value = false
  }
}

async function expandChange(row: Urls, expandedRows: Urls[]) {
  if (expandedRows.find((item) => item.id === row.id)) {
    const { data } = await $fetch<ApiResponse<Urls['analytics']>>(
      `/api/urls/analytics/${row.shortCode}`
    )

    row.analytics = data
  }
}

// 表单规则验证函数
const validateCustomCode: FormItemRule['validator'] = (rule, value, callback) => {
  // function validateCustomCode(rule, value, callback) {
  if (value && !/^[A-Za-z0-9]{6}$/.test(value)) {
    callback(
      new Error(
        'Custom code must be 6 characters long and can only contain letters and numbers'
      )
    )
  } else {
    callback()
  }
}

// Handle form submission
async function submitUserForm() {
  isSubmitting.value = true
  try {
    if (!userFormRef.value) return
    await userFormRef.value.validate(async (isValid: boolean) => {
      if (isValid) {
        const { code, message } = await $fetch<ApiResponse>('/api/urls', {
          method: isEditingUser.value ? 'PUT' : 'POST',
          body: {
            ...urlsForm.value,
            expiresIn: dayjs(urlsForm.value.expiresIn).valueOf(),
          },
        })
        if (code === 0) {
          ElMessage.success(`${isEditingUser.value ? 'Edit' : 'Create'} completed`)
          isDialogVisible.value = false
          await loadUrlsData()
        } else {
          ElMessage.error(message || 'Save failed')
        }
      }
    })
  } finally {
    isSubmitting.value = false
  }
}

function openUserDialog(urlRow?: Url) {
  urlsForm.value = urlRow
    ? {
        id: urlRow.id,
        url: urlRow.url,
        shortCode: urlRow.shortCode,
        expiresIn: urlRow.expirationDate
          ? dayjs(urlRow.expirationDate).format('YYYY-MM-DD HH:mm:ss')
          : '',
      }
    : {
        id: 0,
        url: '',
        shortCode: '',
        expiresIn: dayjs().add(30, 'minute').format('YYYY-MM-DD HH:mm:ss'),
      }
  isDialogVisible.value = true
}

function confirmUserDeletion(shortCode: string) {
  if (!shortCode) return

  ElMessageBox.confirm('Please confirm whether to delete data?', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(async () => {
      await deleteUrl(shortCode)
      await loadUrlsData()
    })
    .catch(() => {})
}

async function deleteUrl(shortCode: string) {
  const { code, message } = await $fetch<ApiResponse>(`/api/urls/${shortCode}`, {
    method: 'DELETE',
  })
  code === 0 && ElMessage.success(message || 'Delete completed')
}

function disabledDate(time: Date) {
  return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
}

function disabledTimeHandler(unit: 'hour' | 'minute' | 'second'): number[] {
  const now = new Date()
  const selectedDate = new Date(urlsForm.value.expiresIn || '')
  const selectedDateOnly = selectedDate.toDateString()

  if (selectedDateOnly !== now.toDateString()) return []

  const handlers: Record<'hour' | 'minute' | 'second', () => number[]> = {
    hour: () => [...Array(now.getHours()).keys()],
    minute: () =>
      selectedDate.getHours() === now.getHours()
        ? [...Array(now.getMinutes()).keys()]
        : [],
    second: () =>
      selectedDate.getHours() === now.getHours() &&
      selectedDate.getMinutes() === now.getMinutes()
        ? [...Array(now.getSeconds()).keys()]
        : [],
  }

  return handlers[unit]()
}

// Initial data load
loadUrlsData()
</script>

<template>
  <div class="rounded py-2 px-4">
    <el-button type="primary" :icon="IconRefresh" circle @click="loadUrlsData" />
    <el-button type="primary" :icon="IconPlus" circle @click="openUserDialog()" />
  </div>
  <el-table
    v-loading="isLoadingTable"
    :data="urlsList"
    :row-key="(row) => row.id"
    @expand-change="expandChange"
  >
    <el-table-column fixed="left" align="center" type="expand">
      <template #default="{ row: { analytics } }">
        <el-descriptions title="Analytics" class="pl-18">
          <el-descriptions-item label="Click Count :">
            {{ analytics && analytics.clickCount ? analytics.clickCount : 0 }}
          </el-descriptions-item>
        </el-descriptions>
      </template>
    </el-table-column>
    <el-table-column fixed="left" align="center" prop="id" label="ID" width="80" />
    <el-table-column prop="shortCode" label="shortCode" width="120" />
    <el-table-column prop="url" label="url" min-width="120" />
    <el-table-column
      prop="expirationDate"
      label="expirationDate"
      min-width="120"
      :formatter="
        ({ expirationDate }) =>
          expirationDate ? dayjs(expirationDate).format('YYYY-MM-DD HH:mm:ss') : ''
      "
    />
    <el-table-column prop="ogTitle" label="ogTitle" min-width="120" />
    <el-table-column prop="ogDescription" label="ogDescription" min-width="120" />

    <el-table-column prop="ogImage" label="ogImage" min-width="120">
      <template #default="scope">
        <el-image
          class="min-w-[72px] w-[72px] h-[108px] rounded-[0.5rem] mr-2"
          fit="cover"
          :src="scope.row.ogImage"
          :preview-src-list="[scope.row.ogImage]"
          preview-teleported
        />
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="Operations" min-width="120">
      <template #default="{ row }">
        <el-button
          tag="a"
          type="primary"
          :icon="IconPromotion"
          :href="`${redirectUrl}/api/urls/u/${row.shortCode}`"
          target="_blank"
          circle
        />
        <el-button type="primary" :icon="IconEdit" circle @click="openUserDialog(row)" />
        <el-button
          type="danger"
          :icon="IconDelete"
          circle
          @click="confirmUserDeletion(row.shortCode)"
        />
      </template>
    </el-table-column>
  </el-table>

  <el-dialog
    v-model="isDialogVisible"
    :title="isEditingUser ? 'Edit User' : 'Add User'"
    width="500"
  >
    <el-form
      ref="userFormRef"
      :model="urlsForm"
      label-width="auto"
      style="max-width: 600px"
    >
      <el-form-item
        label="Url"
        prop="url"
        :rules="[{ required: true, message: 'Please input url', trigger: 'blur' }]"
      >
        <el-input
          v-model="urlsForm.url"
          placeholder="Please input url"
          clearable
          :disabled="isEditingUser"
        />
      </el-form-item>
      <el-form-item
        label="Short Code"
        prop="shortCode"
        :rules="[
          {
            required: false,
            validator: validateCustomCode,
            trigger: 'blur',
          },
        ]"
      >
        <el-input
          v-model="urlsForm.shortCode"
          placeholder="Please input shortCode"
          maxlength="6"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item label="Expiration Date" prop="expiresIn">
        <el-date-picker
          v-model="urlsForm.expiresIn"
          type="datetime"
          placeholder="Select expiration date and time"
          format="YYYY/MM/DD HH:mm:ss"
          style="width: 100%"
          :disabled-date="disabledDate"
          :disabled-hours="() => disabledTimeHandler('hour')"
          :disabled-minutes="() => disabledTimeHandler('minute')"
          :disabled-seconds="() => disabledTimeHandler('second')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="isDialogVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="isSubmitting" @click="submitUserForm">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
