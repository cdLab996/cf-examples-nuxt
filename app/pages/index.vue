<script setup lang="ts">
import {
  Delete as IconDelete,
  Refresh as IconRefresh,
  Plus as IconPlus,
  Edit as IconEdit,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
// import { clientLog } from '~/composables/logger'
import { clientLog } from '../composables/logger'

interface User {
  id: number
  name?: string
  email?: string
}

interface ApiResponse {
  code: number
  data: User[]
  message: string
}

// Variables
const isLoadingTable = ref(false)
const userList = ref<User[]>([])
const isDialogVisible = ref(false)
const userFormRef = ref<FormInstance>()
const userForm = ref<User>({
  id: 0,
  name: '',
  email: '',
})
const isSubmitting = ref(false)

const validationRules = reactive<FormRules<User>>({
  name: [{ required: true, message: 'Please input name', trigger: 'blur' }],
  email: [
    { required: true, message: 'Please input email address', trigger: 'blur' },
    {
      type: 'email',
      message: 'Please input correct email address',
      trigger: ['blur', 'change'],
    },
  ],
})

// Computed
const isEditingUser = computed(() => !!userForm.value.id)

// Functions
async function fetchApiData(url: string, options = {}) {
  try {
    const response = await $fetch<ApiResponse>(url, options)
    if (response.code !== 0) {
      ElMessage.error(response.message)
    }
    return response
  } catch (error) {
    clientLog.error('Error fetching data:', error)
    throw error
  }
}

async function loadUserData() {
  isLoadingTable.value = true
  try {
    const { data } = await fetchApiData('/api/users')
    userList.value = data || []
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
        const apiUrl = isEditingUser.value ? '/api/users' : '/api/users/create'
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

function openUserDialog(user?: User) {
  userForm.value = user
    ? {
        ...user,
      }
    : {
        id: 0,
        name: '',
        email: '',
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
      await fetchApiData('/api/users', {
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
  <el-table v-loading="isLoadingTable" :data="userList">
    <el-table-column prop="id" label="ID" min-width="60" />
    <el-table-column prop="name" label="Name" min-width="120" />
    <el-table-column prop="email" label="Email" min-width="120" />
    <el-table-column fixed="right" label="Operations" min-width="120">
      <template #default="{ row }">
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
      <el-form-item label="Name" prop="name">
        <el-input v-model="userForm.name" />
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="userForm.email" />
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
