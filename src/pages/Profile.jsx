import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Profile() {
  const { username } = useParams()

  const [profile, setProfile] = useState(null)

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()

    setProfile(data)
  }

  if (!profile) {
    return (
      <div className="p-10">
        Profile not found
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-10">

      <div className="bg-white rounded-3xl shadow p-8">

        <h1 className="text-3xl font-bold">
          {profile.display_name || profile.username}
        </h1>

        <p className="text-gray-500 mt-2">
          @{profile.username}
        </p>

        {profile.bio && (
          <p className="mt-6">
            {profile.bio}
          </p>
        )}

      </div>

    </div>
  )
}