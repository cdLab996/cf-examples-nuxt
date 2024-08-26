<script setup lang="ts">
import {
  Delete as IconDelete,
  Refresh as IconRefresh,
  Plus as IconPlus,
  Edit as IconEdit,
  Promotion as IconPromotion,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import logger from '~~/app/composables/logger'

interface User {
  // id: number
  url: string
}

interface Urls {
  id: number // 主键ID
  shortCode: string // 短代码
  url: string // 原始URL
  expirationDate?: number // 过期日期（可选）
  ogTitle?: string // OG标题（可选）
  ogDescription?: string // OG描述（可选）
  ogImage?: string // OG图片URL（可选）
}

interface ApiResponse {
  code: number
  data: Urls[]
  message: string
}

const {
  public: { redirectUrl },
} = useRuntimeConfig()
logger.log('🚀 ~ redirectUrl:', redirectUrl)

// Variables
const isLoadingTable = ref(false)
const urlsList = ref<Urls[]>([])
const isDialogVisible = ref(false)
const userFormRef = ref<FormInstance>()
const userForm = ref({
  url: '',
})
const isSubmitting = ref(false)

const validationRules = reactive<FormRules<User>>({
  url: [{ required: true, message: 'Please input url', trigger: 'blur' }],
  // email: [
  //   { required: true, message: 'Please input email address', trigger: 'blur' },
  //   {
  //     type: 'email',
  //     message: 'Please input correct email address',
  //     trigger: ['blur', 'change'],
  //   },
  // ],
})

// Computed
// const isEditingUser = computed(() => !!userForm.value.id)
const isEditingUser = computed(() => !true)

// Functions
async function fetchApiData(url: string, options = {}) {
  try {
    const response = await $fetch<ApiResponse>(url, options)
    if (response.code !== 0) {
      ElMessage.error(response.message)
    }
    return response
  } catch (error) {
    logger.error('Error fetching data:', error)
    throw error
  }
}

async function loadUserData() {
  isLoadingTable.value = true
  try {
    const { data } = await fetchApiData('/api/urls')
    urlsList.value = data || []
  } finally {
    isLoadingTable.value = false
  }
}

// Handle form submission
async function submitUserForm() {
  isSubmitting.value = true
  try {
    if (!userFormRef.value) return
    await userFormRef.value.validate(async (isValid) => {
      if (isValid) {
        const apiUrl = isEditingUser.value ? '/api/urls' : '/api/urls'
        const httpMethod = isEditingUser.value ? 'PUT' : 'POST'
        await fetchApiData(apiUrl, {
          method: httpMethod,
          body: {
            ...userForm.value,
          },
        })
        ElMessage.success(`${isEditingUser.value ? 'Edit' : 'Create'} completed`)
        isDialogVisible.value = false
        await loadUserData()
      }
    })
  } finally {
    isSubmitting.value = false
  }
}

function handleSortUrl(shortCode: string) {
  window.open(`${redirectUrl}/${shortCode}`, '_blank')
}

function openUserDialog(user?: User) {
  userForm.value = user
    ? {
        ...user,
      }
    : {
        // id: 0,
        url: '',
      }
  isDialogVisible.value = true
}

function confirmUserDeletion(userId: number) {
  ElMessageBox.confirm('Please confirm whether to delete data?', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(async () => {
      await fetchApiData('/api/urls', {
        method: 'DELETE',
        body: {
          id: userId,
        },
      })
      ElMessage.success('Delete completed')
      await loadUserData()
    })
    .catch(() => {})
}

// Initial data load
loadUserData()
</script>

<template>
  <div class="rounded py-2 px-4">
    <el-button type="primary" :icon="IconRefresh" circle @click="loadUserData" />
    <el-button type="primary" :icon="IconPlus" circle @click="openUserDialog()" />
  </div>
  <el-table v-loading="isLoadingTable" :data="urlsList">
    <el-table-column prop="id" label="ID" min-width="60" />
    <el-table-column prop="shortCode" label="shortCode" min-width="120" />
    <el-table-column prop="url" label="url" min-width="120" />
    <el-table-column prop="expirationDate" label="expirationDate" min-width="120" />
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
          @click="confirmUserDeletion(row.id)"
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
      :model="userForm"
      :rules="validationRules"
      label-width="auto"
      style="max-width: 600px"
    >
      <el-form-item label="Url" prop="url">
        <el-input v-model="userForm.url" />
      </el-form-item>
      <!-- <el-form-item label="Email" prop="email">
        <el-input v-model="userForm.email" />
      </el-form-item> -->
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
