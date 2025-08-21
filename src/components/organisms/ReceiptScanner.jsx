import React, { useState, useRef } from 'react'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import FormField from '@/components/molecules/FormField'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import { cn } from '@/utils/cn'

const ReceiptScanner = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = useState('upload') // 'upload', 'processing', 'preview', 'edit'
  const [uploadedFile, setUploadedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [ocrData, setOcrData] = useState(null)
  const [extractedData, setExtractedData] = useState({
    vendor: '',
    amount: '',
    date: '',
    description: '',
    category: 'office-supplies',
    dueDate: '',
    billNumber: '',
    taxAmount: ''
  })
  const [fieldConfidence, setFieldConfidence] = useState({})
  const [fieldErrors, setFieldErrors] = useState({})
  const [manuallyEdited, setManuallyEdited] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPG, PNG, etc.)')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB')
      return
    }

    setUploadedFile(file)
    
    // Create image preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target.result)
      setStep('processing')
      processOCR(file)
    }
    reader.readAsDataURL(file)
  }

const processOCR = async (file) => {
    setIsProcessing(true)
    
    try {
      // Simulate OCR processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock OCR extracted data with field-level confidence scores
      const mockExtractedData = {
        vendor: 'Office Depot',
        amount: '156.78',
        date: '2024-01-15',
        description: 'Office supplies and stationery',
        category: 'office-supplies',
        dueDate: '2024-02-15',
        billNumber: 'INV-2024-001',
        taxAmount: '12.54'
      }

      // Mock field confidence scores
      const mockFieldConfidence = {
        vendor: 0.95,
        amount: 0.88,
        date: 0.92,
        description: 0.76,
        category: 0.89,
        dueDate: 0.72,
        billNumber: 0.94,
        taxAmount: 0.81
      }

      // Identify potential errors (low confidence fields)
      const mockFieldErrors = {}
      Object.keys(mockFieldConfidence).forEach(field => {
        if (mockFieldConfidence[field] < 0.8) {
          mockFieldErrors[field] = 'Low confidence - please verify'
        }
      })

      setExtractedData(mockExtractedData)
      setFieldConfidence(mockFieldConfidence)
      setFieldErrors(mockFieldErrors)
      setManuallyEdited({})
      setOcrData({
        confidence: 0.923,
        extractedFields: 8,
        processedAt: new Date().toISOString()
      })
      
      setStep('edit') // Go directly to edit mode for field verification
      toast.success('Receipt processed - please verify extracted fields!')
    } catch (error) {
      toast.error('Failed to process receipt. Please try again.')
      setStep('upload')
    } finally {
      setIsProcessing(false)
    }
  }

const handleInputChange = (field, value) => {
    setExtractedData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Mark field as manually edited
    setManuallyEdited(prev => ({
      ...prev,
      [field]: true
    }))
    
    // Clear field error if user manually corrects it
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const updated = { ...prev }
        delete updated[field]
        return updated
      })
    }
  }

  const getFieldValidationState = (field) => {
    if (manuallyEdited[field]) return 'edited'
    if (fieldErrors[field]) return 'error'
    const confidence = fieldConfidence[field] || 0
    if (confidence > 0.9) return 'high'
    if (confidence > 0.8) return 'medium'
    return 'low'
  }

  const getFieldIndicatorIcon = (field) => {
    const state = getFieldValidationState(field)
    switch (state) {
      case 'edited': return 'CheckCircle2'
      case 'error': return 'AlertTriangle'
      case 'high': return 'CheckCircle'
      case 'medium': return 'AlertCircle'
      case 'low': return 'XCircle'
      default: return 'Circle'
    }
  }

  const getFieldIndicatorColor = (field) => {
    const state = getFieldValidationState(field)
    switch (state) {
      case 'edited': return 'text-green-600'
      case 'error': return 'text-red-500'
      case 'high': return 'text-green-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-red-400'
      default: return 'text-slate-400'
    }
  }

  const handleSave = () => {
    if (!extractedData.vendor || !extractedData.amount) {
      toast.error('Vendor and amount are required fields')
      return
    }

    const billData = {
      ...extractedData,
      Id: Date.now(), // Mock ID generation
      status: 'pending',
      createdAt: new Date().toISOString(),
      ocrProcessed: true,
      originalFile: uploadedFile?.name
    }

    onSave(billData)
    toast.success('Bill saved successfully!')
    handleClose()
  }

const handleClose = () => {
    setStep('upload')
    setUploadedFile(null)
    setImagePreview('')
    setOcrData(null)
    setExtractedData({
      vendor: '',
      amount: '',
      date: '',
      description: '',
      category: 'office-supplies',
      dueDate: '',
      billNumber: '',
      taxAmount: ''
    })
    setFieldConfidence({})
    setFieldErrors({})
    setManuallyEdited({})
    setIsProcessing(false)
    onClose()
  }

const handleRetake = () => {
    setStep('upload')
    setUploadedFile(null)
    setImagePreview('')
    setOcrData(null)
    setFieldConfidence({})
    setFieldErrors({})
    setManuallyEdited({})
    fileInputRef.current.value = ''
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Scan" className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Receipt Scanner</h2>
              <p className="text-sm text-slate-500">Upload and process receipt with AI OCR</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        </div>

        {/* Upload Step */}
        {step === 'upload' && (
          <div className="p-6">
            <div className="text-center">
              <div 
                className="border-2 border-dashed border-slate-300 rounded-xl p-12 hover:border-purple-400 hover:bg-purple-50/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Upload" className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Upload Receipt Image</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Drag and drop your receipt or click to browse
                </p>
                <p className="text-xs text-slate-400">
                  Supports JPG, PNG, GIF up to 10MB
                </p>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <div className="flex items-center justify-center mt-6 space-x-4">
                <Button variant="outline" icon="Camera">
                  Take Photo
                </Button>
                <Button variant="outline" icon="FolderOpen" onClick={() => fileInputRef.current?.click()}>
                  Choose File
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Processing Step */}
        {step === 'processing' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image Preview */}
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-4">Receipt Image</h3>
                <div className="bg-slate-50 rounded-lg p-4">
                  <img 
                    src={imagePreview} 
                    alt="Receipt preview" 
                    className="w-full h-64 object-contain rounded-lg"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={handleRetake} className="mt-3">
                  <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
                  Retake
                </Button>
              </div>

              {/* Processing Status */}
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-4">AI Processing</h3>
                <div className="space-y-4">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <Loading className="w-5 h-5 text-purple-600 mr-3" />
                      <span className="font-medium text-purple-900">Processing Receipt...</span>
                    </div>
                    <div className="space-y-2 text-sm text-purple-700">
                      <div className="flex items-center">
                        <ApperIcon name="CheckCircle" className="w-4 h-4 text-green-500 mr-2" />
                        Image uploaded and validated
                      </div>
                      <div className="flex items-center">
                        <Loading className="w-4 h-4 text-purple-600 mr-2" />
                        Extracting text with OCR
                      </div>
                      <div className="flex items-center">
                        <ApperIcon name="Circle" className="w-4 h-4 text-slate-400 mr-2" />
                        Identifying vendor and amounts
                      </div>
                      <div className="flex items-center">
                        <ApperIcon name="Circle" className="w-4 h-4 text-slate-400 mr-2" />
                        Structuring data fields
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-2">Processing Details</h4>
                    <div className="text-sm text-slate-600 space-y-1">
                      <div>File: {uploadedFile?.name}</div>
                      <div>Size: {(uploadedFile?.size / 1024 / 1024).toFixed(2)} MB</div>
                      <div>Type: {uploadedFile?.type}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview & Edit Step */}
        {(step === 'preview' || step === 'edit') && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image Preview */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-slate-900">Receipt Image</h3>
                  {ocrData && (
                    <div className="flex items-center text-sm text-green-600">
                      <ApperIcon name="CheckCircle" className="w-4 h-4 mr-1" />
                      {(ocrData.confidence * 100).toFixed(1)}% confidence
                    </div>
                  )}
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <img 
                    src={imagePreview} 
                    alt="Receipt preview" 
                    className="w-full h-64 object-contain rounded-lg"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={handleRetake} className="mt-3">
                  <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
                  Upload Different Image
                </Button>
              </div>

{/* Field Extraction Editor */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-slate-900">Field Extraction Editor</h3>
                    <p className="text-sm text-slate-500">Verify and adjust extracted fields</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setStep(step === 'preview' ? 'edit' : 'preview')}
                  >
                    <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
                    {step === 'preview' ? 'Edit Fields' : 'Preview Mode'}
                  </Button>
                </div>

                {/* Field Status Summary */}
                {step === 'edit' && Object.keys(fieldConfidence).length > 0 && (
                  <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-3">Extraction Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <ApperIcon name="CheckCircle" className="w-4 h-4 text-green-500 mr-2" />
                        <span>{Object.values(fieldConfidence).filter(c => c > 0.9).length} High Confidence</span>
                      </div>
                      <div className="flex items-center">
                        <ApperIcon name="AlertCircle" className="w-4 h-4 text-yellow-500 mr-2" />
                        <span>{Object.values(fieldConfidence).filter(c => c <= 0.9 && c > 0.8).length} Medium Confidence</span>
                      </div>
                      <div className="flex items-center">
                        <ApperIcon name="XCircle" className="w-4 h-4 text-red-400 mr-2" />
                        <span>{Object.values(fieldConfidence).filter(c => c <= 0.8).length} Low Confidence</span>
                      </div>
                      <div className="flex items-center">
                        <ApperIcon name="CheckCircle2" className="w-4 h-4 text-green-600 mr-2" />
                        <span>{Object.keys(manuallyEdited).length} Manually Verified</span>
                      </div>
                    </div>
                  </div>
                )}

<div className="space-y-4">
                  <FormField 
                    label={
                      <div className="flex items-center justify-between">
                        <span>Vendor Name <span className="text-red-500">*</span></span>
                        {step === 'edit' && fieldConfidence.vendor && (
                          <div className="flex items-center text-xs">
                            <ApperIcon 
                              name={getFieldIndicatorIcon('vendor')} 
                              className={cn("w-3 h-3 mr-1", getFieldIndicatorColor('vendor'))} 
                            />
                            <span className={getFieldIndicatorColor('vendor')}>
                              {manuallyEdited.vendor ? 'Verified' : `${(fieldConfidence.vendor * 100).toFixed(0)}%`}
                            </span>
                          </div>
                        )}
                      </div>
                    }
                    error={fieldErrors.vendor}
                  >
                    <Input
                      value={extractedData.vendor}
                      onChange={(e) => handleInputChange('vendor', e.target.value)}
                      readOnly={step === 'preview'}
                      className={cn(
                        step === 'preview' ? 'bg-slate-50' : '',
                        fieldErrors.vendor ? 'border-red-300 focus:border-red-500' : '',
                        manuallyEdited.vendor ? 'border-green-300 bg-green-50' : ''
                      )}
                      placeholder="Enter vendor name"
                    />
                  </FormField>

<div className="grid grid-cols-2 gap-4">
                    <FormField 
                      label={
                        <div className="flex items-center justify-between">
                          <span>Amount <span className="text-red-500">*</span></span>
                          {step === 'edit' && fieldConfidence.amount && (
                            <div className="flex items-center text-xs">
                              <ApperIcon 
                                name={getFieldIndicatorIcon('amount')} 
                                className={cn("w-3 h-3 mr-1", getFieldIndicatorColor('amount'))} 
                              />
                              <span className={getFieldIndicatorColor('amount')}>
                                {manuallyEdited.amount ? 'Verified' : `${(fieldConfidence.amount * 100).toFixed(0)}%`}
                              </span>
                            </div>
                          )}
                        </div>
                      }
                      error={fieldErrors.amount}
                    >
                      <Input
                        type="number"
                        step="0.01"
                        value={extractedData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        readOnly={step === 'preview'}
                        className={cn(
                          step === 'preview' ? 'bg-slate-50' : '',
                          fieldErrors.amount ? 'border-red-300 focus:border-red-500' : '',
                          manuallyEdited.amount ? 'border-green-300 bg-green-50' : ''
                        )}
                        placeholder="0.00"
                      />
                    </FormField>

                    <FormField 
                      label={
                        <div className="flex items-center justify-between">
                          <span>Tax Amount</span>
                          {step === 'edit' && fieldConfidence.taxAmount && (
                            <div className="flex items-center text-xs">
                              <ApperIcon 
                                name={getFieldIndicatorIcon('taxAmount')} 
                                className={cn("w-3 h-3 mr-1", getFieldIndicatorColor('taxAmount'))} 
                              />
                              <span className={getFieldIndicatorColor('taxAmount')}>
                                {manuallyEdited.taxAmount ? 'Verified' : `${(fieldConfidence.taxAmount * 100).toFixed(0)}%`}
                              </span>
                            </div>
                          )}
                        </div>
                      }
                      error={fieldErrors.taxAmount}
                    >
                      <Input
                        type="number"
                        step="0.01"
                        value={extractedData.taxAmount}
                        onChange={(e) => handleInputChange('taxAmount', e.target.value)}
                        readOnly={step === 'preview'}
                        className={cn(
                          step === 'preview' ? 'bg-slate-50' : '',
                          fieldErrors.taxAmount ? 'border-red-300 focus:border-red-500' : '',
                          manuallyEdited.taxAmount ? 'border-green-300 bg-green-50' : ''
                        )}
                        placeholder="0.00"
                      />
                    </FormField>
                  </div>

<div className="grid grid-cols-2 gap-4">
                    <FormField 
                      label={
                        <div className="flex items-center justify-between">
                          <span>Date</span>
                          {step === 'edit' && fieldConfidence.date && (
                            <div className="flex items-center text-xs">
                              <ApperIcon 
                                name={getFieldIndicatorIcon('date')} 
                                className={cn("w-3 h-3 mr-1", getFieldIndicatorColor('date'))} 
                              />
                              <span className={getFieldIndicatorColor('date')}>
                                {manuallyEdited.date ? 'Verified' : `${(fieldConfidence.date * 100).toFixed(0)}%`}
                              </span>
                            </div>
                          )}
                        </div>
                      }
                      error={fieldErrors.date}
                    >
                      <Input
                        type="date"
                        value={extractedData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        readOnly={step === 'preview'}
                        className={cn(
                          step === 'preview' ? 'bg-slate-50' : '',
                          fieldErrors.date ? 'border-red-300 focus:border-red-500' : '',
                          manuallyEdited.date ? 'border-green-300 bg-green-50' : ''
                        )}
                      />
                    </FormField>

                    <FormField 
                      label={
                        <div className="flex items-center justify-between">
                          <span>Due Date</span>
                          {step === 'edit' && fieldConfidence.dueDate && (
                            <div className="flex items-center text-xs">
                              <ApperIcon 
                                name={getFieldIndicatorIcon('dueDate')} 
                                className={cn("w-3 h-3 mr-1", getFieldIndicatorColor('dueDate'))} 
                              />
                              <span className={getFieldIndicatorColor('dueDate')}>
                                {manuallyEdited.dueDate ? 'Verified' : `${(fieldConfidence.dueDate * 100).toFixed(0)}%`}
                              </span>
                            </div>
                          )}
                        </div>
                      }
                      error={fieldErrors.dueDate}
                    >
                      <Input
                        type="date"
                        value={extractedData.dueDate}
                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                        readOnly={step === 'preview'}
                        className={cn(
                          step === 'preview' ? 'bg-slate-50' : '',
                          fieldErrors.dueDate ? 'border-red-300 focus:border-red-500' : '',
                          manuallyEdited.dueDate ? 'border-green-300 bg-green-50' : ''
                        )}
                      />
                    </FormField>
                  </div>

<FormField 
                    label={
                      <div className="flex items-center justify-between">
                        <span>Bill Number</span>
                        {step === 'edit' && fieldConfidence.billNumber && (
                          <div className="flex items-center text-xs">
                            <ApperIcon 
                              name={getFieldIndicatorIcon('billNumber')} 
                              className={cn("w-3 h-3 mr-1", getFieldIndicatorColor('billNumber'))} 
                            />
                            <span className={getFieldIndicatorColor('billNumber')}>
                              {manuallyEdited.billNumber ? 'Verified' : `${(fieldConfidence.billNumber * 100).toFixed(0)}%`}
                            </span>
                          </div>
                        )}
                      </div>
                    }
                    error={fieldErrors.billNumber}
                  >
                    <Input
                      value={extractedData.billNumber}
                      onChange={(e) => handleInputChange('billNumber', e.target.value)}
                      readOnly={step === 'preview'}
                      className={cn(
                        step === 'preview' ? 'bg-slate-50' : '',
                        fieldErrors.billNumber ? 'border-red-300 focus:border-red-500' : '',
                        manuallyEdited.billNumber ? 'border-green-300 bg-green-50' : ''
                      )}
                      placeholder="Invoice or bill number"
                    />
                  </FormField>

<FormField 
                    label={
                      <div className="flex items-center justify-between">
                        <span>Category</span>
                        {step === 'edit' && fieldConfidence.category && (
                          <div className="flex items-center text-xs">
                            <ApperIcon 
                              name={getFieldIndicatorIcon('category')} 
                              className={cn("w-3 h-3 mr-1", getFieldIndicatorColor('category'))} 
                            />
                            <span className={getFieldIndicatorColor('category')}>
                              {manuallyEdited.category ? 'Verified' : `${(fieldConfidence.category * 100).toFixed(0)}%`}
                            </span>
                          </div>
                        )}
                      </div>
                    }
                    error={fieldErrors.category}
                  >
                    <Select
                      value={extractedData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      disabled={step === 'preview'}
                      className={cn(
                        step === 'preview' ? 'bg-slate-50' : '',
                        fieldErrors.category ? 'border-red-300 focus:border-red-500' : '',
                        manuallyEdited.category ? 'border-green-300 bg-green-50' : ''
                      )}
                    >
                      <option value="office-supplies">Office Supplies</option>
                      <option value="utilities">Utilities</option>
                      <option value="rent">Rent & Facilities</option>
                      <option value="marketing">Marketing</option>
                      <option value="technology">Technology</option>
                      <option value="travel">Travel & Entertainment</option>
                      <option value="professional">Professional Services</option>
                      <option value="other">Other</option>
                    </Select>
                  </FormField>

<FormField 
                    label={
                      <div className="flex items-center justify-between">
                        <span>Description</span>
                        {step === 'edit' && fieldConfidence.description && (
                          <div className="flex items-center text-xs">
                            <ApperIcon 
                              name={getFieldIndicatorIcon('description')} 
                              className={cn("w-3 h-3 mr-1", getFieldIndicatorColor('description'))} 
                            />
                            <span className={getFieldIndicatorColor('description')}>
                              {manuallyEdited.description ? 'Verified' : `${(fieldConfidence.description * 100).toFixed(0)}%`}
                            </span>
                          </div>
                        )}
                      </div>
                    }
                    error={fieldErrors.description}
                  >
                    <Input
                      value={extractedData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      readOnly={step === 'preview'}
                      className={cn(
                        step === 'preview' ? 'bg-slate-50' : '',
                        fieldErrors.description ? 'border-red-300 focus:border-red-500' : '',
                        manuallyEdited.description ? 'border-green-300 bg-green-50' : ''
                      )}
                      placeholder="Brief description of the expense"
                    />
                  </FormField>
                </div>

{/* Field Extraction Tips */}
                {step === 'edit' && Object.keys(fieldErrors).length > 0 && (
                  <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <h4 className="font-medium text-amber-900 mb-2 flex items-center">
                      <ApperIcon name="AlertTriangle" className="w-4 h-4 mr-2" />
                      Fields Requiring Attention
                    </h4>
                    <div className="text-sm text-amber-700 space-y-1">
                      {Object.entries(fieldErrors).map(([field, error]) => (
                        <div key={field} className="flex items-center">
                          <ApperIcon name="Dot" className="w-3 h-3 mr-1" />
                          <span className="capitalize">{field.replace(/([A-Z])/g, ' $1')}</span>: {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {ocrData && (
                  <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-2">Processing Details</h4>
                    <div className="text-sm text-slate-600 space-y-1">
                      <div>Overall Confidence: {(ocrData.confidence * 100).toFixed(1)}%</div>
                      <div>Fields Extracted: {ocrData.extractedFields}</div>
                      <div>Processed: {new Date(ocrData.processedAt).toLocaleString()}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={handleRetake}>
                  <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
                  Upload New Image
                </Button>
                <Button onClick={handleSave} disabled={!extractedData.vendor || !extractedData.amount}>
                  <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                  Save Bill
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReceiptScanner