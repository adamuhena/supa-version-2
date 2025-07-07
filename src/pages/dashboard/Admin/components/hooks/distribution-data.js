"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { API_BASE_URL } from "@/config/env"

/**
 * @typedef {Object} UseDistributionDataOptions
 * @property {string} endpoint
 * @property {boolean} [enabled]
 * @property {any[]} [dependencies]
 */

export function useDistributionData({ endpoint, enabled = true, dependencies = [] }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    if (!enabled) return

    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) {
      setError("Access token is missing. Please log in again.")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (response.data.success) {
        setData(response.data.data)
      } else {
        throw new Error(response.data.message || "Failed to fetch data")
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [enabled, ...dependencies])

  return { data, loading, error, refetch: fetchData }
}
