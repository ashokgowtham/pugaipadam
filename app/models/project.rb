class Project
  include Mongoid::Document

  field :project_id, type: Integer
  field :account_name, type: String
  field :project_name, type: String

  has_many :consultants

  def name
    "#{self.account_name} - #{project_name}"
  end
end
