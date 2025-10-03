import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Save, Plus, Trash2, Settings as SettingsIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';

interface SiteConfig {
  id: string;
  key: string;
  value: any;
  description: string;
  updated_at: string;
}

interface District {
  name: string;
  deliveryFee: number;
  available: boolean;
}

export function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [siteName, setSiteName] = useState('Amazonia Crujiente');
  const [siteDescription, setSiteDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [districts, setDistricts] = useState<District[]>([
    { name: 'San Miguel', deliveryFee: 5, available: true },
    { name: 'Magdalena', deliveryFee: 5, available: true },
    { name: 'Pueblo Libre', deliveryFee: 6, available: true },
  ]);
  const [openingHours, setOpeningHours] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState(15);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_config')
        .select('*');

      if (error) throw error;

      data?.forEach((config: SiteConfig) => {
        switch (config.key) {
          case 'site_name':
            setSiteName(config.value);
            break;
          case 'site_description':
            setSiteDescription(config.value);
            break;
          case 'contact_phone':
            setContactPhone(config.value);
            break;
          case 'contact_email':
            setContactEmail(config.value);
            break;
          case 'facebook_url':
            setFacebookUrl(config.value);
            break;
          case 'instagram_url':
            setInstagramUrl(config.value);
            break;
          case 'whatsapp_number':
            setWhatsappNumber(config.value);
            break;
          case 'districts':
            setDistricts(config.value);
            break;
          case 'opening_hours':
            setOpeningHours(config.value);
            break;
          case 'min_order_amount':
            setMinOrderAmount(config.value);
            break;
        }
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);

      const settings = [
        { key: 'site_name', value: siteName, description: 'Nombre del sitio' },
        { key: 'site_description', value: siteDescription, description: 'Descripción del sitio' },
        { key: 'contact_phone', value: contactPhone, description: 'Teléfono de contacto' },
        { key: 'contact_email', value: contactEmail, description: 'Email de contacto' },
        { key: 'facebook_url', value: facebookUrl, description: 'URL de Facebook' },
        { key: 'instagram_url', value: instagramUrl, description: 'URL de Instagram' },
        { key: 'whatsapp_number', value: whatsappNumber, description: 'Número de WhatsApp' },
        { key: 'districts', value: districts, description: 'Distritos de delivery' },
        { key: 'opening_hours', value: openingHours, description: 'Horario de atención' },
        { key: 'min_order_amount', value: minOrderAmount, description: 'Monto mínimo de pedido' },
      ];

      for (const setting of settings) {
        const { data: existing } = await supabase
          .from('site_config')
          .select('id')
          .eq('key', setting.key)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('site_config')
            .update({
              value: setting.value,
              description: setting.description,
              updated_at: new Date().toISOString(),
            })
            .eq('key', setting.key);
        } else {
          await supabase
            .from('site_config')
            .insert([{
              key: setting.key,
              value: setting.value,
              description: setting.description,
            }]);
        }
      }

      alert('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const addDistrict = () => {
    setDistricts([...districts, { name: '', deliveryFee: 5, available: true }]);
  };

  const removeDistrict = (index: number) => {
    setDistricts(districts.filter((_, i) => i !== index));
  };

  const updateDistrict = (index: number, field: keyof District, value: any) => {
    const updated = [...districts];
    updated[index] = { ...updated[index], [field]: value };
    setDistricts(updated);
  };

  if (loading) {
    return (
      <AdminLayout currentPage="settings">
        <div className="p-8 text-center text-gray-500">Cargando configuración...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="settings">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configuración del Sitio</h1>
            <p className="text-gray-600 mt-1">Administra la configuración general</p>
          </div>
          <Button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
          </Button>
        </div>

        {/* General Settings */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="flex items-center space-x-2 pb-4 border-b border-gray-200">
            <SettingsIcon className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Información General</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del sitio
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono de contacto
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+51 999 888 777"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email de contacto
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contacto@amazoniacrujiente.pe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de WhatsApp
              </label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="51999888777"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del sitio
              </label>
              <textarea
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de Facebook
              </label>
              <input
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de Instagram
              </label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Business Settings */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 pb-4 border-b border-gray-200">
            Configuración de Negocio
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horario de atención
              </label>
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                placeholder="Lun-Dom 9:00 AM - 9:00 PM"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monto mínimo de pedido (S/)
              </label>
              <input
                type="number"
                step="0.01"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Delivery Districts */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Distritos de Delivery</h2>
            <Button onClick={addDistrict} size="sm" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Agregar Distrito</span>
            </Button>
          </div>

          <div className="space-y-3">
            {districts.map((district, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  value={district.name}
                  onChange={(e) => updateDistrict(index, 'name', e.target.value)}
                  placeholder="Nombre del distrito"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
                />
                <input
                  type="number"
                  step="0.01"
                  value={district.deliveryFee}
                  onChange={(e) => updateDistrict(index, 'deliveryFee', parseFloat(e.target.value))}
                  placeholder="Costo delivery"
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
                />
                <label className="flex items-center space-x-2 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={district.available}
                    onChange={(e) => updateDistrict(index, 'available', e.target.checked)}
                    className="rounded border-gray-300 text-[#0B8A5F] focus:ring-[#0B8A5F]"
                  />
                  <span className="text-sm text-gray-700">Disponible</span>
                </label>
                <button
                  onClick={() => removeDistrict(index)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save button at bottom */}
        <div className="flex justify-end">
          <Button
            onClick={saveSettings}
            disabled={saving}
            size="lg"
            className="flex items-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Guardando...' : 'Guardar Configuración'}</span>
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
